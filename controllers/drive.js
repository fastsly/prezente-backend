const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
function handleGdrive(opt,callback){
if(opt === 'list'){
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  return authorize(JSON.parse(content), listFiles,callback)
});
}else {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    return authorize(JSON.parse(content), download,callback)
  });
}

}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, callback2) {
  
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    return callback(oAuth2Client,callback2);
  });
  
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
 function listFiles(auth,callback) {
   console.log('asd');
  const drive = google.drive({version: 'v3', auth}); 
    drive.files.list({
      q: "'1ZuxGqjZV2ZsoWMbqOv_1JChX4VkFXrmC' in parents",
      pageSize: 100,
      fields: 'nextPageToken, files(id, name)',
    },callback
    // (err, res) => {
    //   if (err) return console.log('The API returned an error: ' + err);
    //   const files = res.data.files;
    //   if (files.length) {
    //     //console.log('Files:');
    //     const fileNames = files.map((file) => {
    //       //console.table(`${file.name} (${file.id})`);
    //       return file.name.split(' ')[0]+" "+file.name.split(' ')[1]
    //     });
    //     //console.table(fileNames)
    //     return (Promise.resolve(fileNames))
    //   } else {
    //     console.log('No files found.');
    //   }
    // }
    )
    //.on('end', ()=> console.log('fuck'))
}

const download = (auth,callback) =>
{
    const drive = google.drive({version: 'v3', auth}); 
    const folderId = '1ZuxGqjZV2ZsoWMbqOv_1JChX4VkFXrmC'
    var fileId = '0BwwA4oUTeiV1UVNwOHItT0xfa2M';
    var dest = fs.createWriteStream('./temp.docx');
    drive.files.list({
      q: "'1ZuxGqjZV2ZsoWMbqOv_1JChX4VkFXrmC' in parents",
      pageSize: 100,
      fields: 'nextPageToken, files(id, name)',
    },
    (err,resp)=>{
      const files = resp.data.files;
      let fileIds = []
      if (files.length) {
        fileIds.push(resp.data.files.id)        
      }
        // drive.files.get({
        //   fileId: fileIds[0],
        //   alt: 'media'
        //   })
        //       .on('end', function () {
        //       console.log('Done');
        //       })
        //       .on('error', function (err) {
        //       console.log('Error during download', err);
        //       })
        //       .pipe(dest)
              
        return drive.files
        .get({fileId, alt: 'media'}, {responseType: 'stream'})
        .then(res => {
          return new Promise((resolve, reject) => {
            const filePath = path.join(os.tmpdir(), uuid.v4());
            console.log(`writing to ${filePath}`);
            const dest = fs.createWriteStream(filePath);
            let progress = 0;
    
            res.data
              .on('end', () => {
                console.log('Done downloading file.');
                resolve(filePath);
              })
              .on('error', err => {
                console.error('Error downloading file.');
                reject(err);
              })
              .on('data', d => {
                progress += d.length;
                if (process.stdout.isTTY) {
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  process.stdout.write(`Downloaded ${progress} bytes`);
                }
              })
              .pipe(dest);
          });
        });
              
    })
    
    //return dest
}

module.exports = {
  handleGdrive
}