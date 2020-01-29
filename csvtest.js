const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csvtojson')
const fileUpload = require('express-fileupload')

// default options
app.use(fileUpload());

app.post('/',  (req, res)=>{
//  let files = await req.files
let sampleFile = req.files.sampleFile;

  console.log(sampleFile);
  /**
   * Read csv file and save every row of
   * data on mongodb database
   */
  // csv()
  //   .fromFile(req.files.csv)
  //   .then(data=>{
  //     data.forEach((item) => {
  //       console.log(item);
  //     })
  //
  // })
  // .catch(err=>{
  //   res.send(err.message)
  // })
})

app.listen(5000, ()=>{
  console.log("listening on 5000");
})
