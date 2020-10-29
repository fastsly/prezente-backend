const XLSX = require("xlsx");
const fs = require('fs');

const data =[
    {
      "name": "Putnoki Lorand",
      "date": "2020-10-29T09:25:42.417Z",
      "temp": 36.5,
      "cosemnat": "Szalai Laszlo"
    },
    {
        "name": "Putnoki Lorand",
        "date": "2020-11-29T09:25:42.417Z",
        "temp": 36.5,
        "cosemnat": "Szalai Laszlo"
    }
  ]
  let arrayPrezente  = []
  arrayPrezente.push(['Data','Temperatura','Pers. care consemneaza'])
  data.forEach(obj => {
    arrayPrezente.push([obj.date.slice(0,10),obj.temp, obj.cosemnat ])
  })
  
  
/* generate workbook */
  var ws = XLSX.utils.aoa_to_sheet(arrayPrezente);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

  /* generate buffer */
  //var buf = XLSX.write(wb, { type: "buffer", bookType: bookType || "xlsx" });



  XLSX.writeFile(wb, 'out.xlsx');
