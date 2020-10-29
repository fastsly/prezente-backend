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
    },
    {
      "name": "Buroi Alexandra",
      "date": "2020-11-29T09:25:42.417Z",
      "temp": 36.5,
      "cosemnat": "Szalai Laszlo"
  }
  ]
  const listBenef = require('./listBenef.json')
  data.forEach(obj => {
    Object.keys(listBenef).map((key, index) => {
      if(obj.name === listBenef[key].name){
      listBenef[key].array.push([obj.date.slice(0,10),obj.temp, obj.cosemnat ])
      }
    });
  })
  
  
/* generate workbook */
  var wb = XLSX.utils.book_new();
  Object.keys(listBenef).map((key, index) => {
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(listBenef[key].array),listBenef[key].name)
  })


  // var ws = XLSX.utils.aoa_to_sheet(arrayPrezente);
  // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

  /* generate buffer */
  //var buf = XLSX.write(wb, { type: "buffer", bookType: bookType || "xlsx" });



  XLSX.writeFile(wb, 'out.xlsx');
