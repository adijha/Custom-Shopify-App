const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require("body-parser");
//const CsvTest = require('../model/CsvTest');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const csv=require('csvtojson')
//var upload = multer({ 	storage: multer.memoryStorage() });

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));


//connect Db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
	console.log('Db is connected')
);

app.use(fileUpload({
  useTempFiles : true,
   tempFileDir : '/tmp/'
}));
app.use(express.json());

app.get('/', (req,res)=>{
  res.sendFile(__dirname+'/test.html');
})

// app.post('/test', upload.single('avatar'), async (req, res)=>{
//  console.log("file is", req.file);
// // console.log("req.body is", req.body);
//  const csvFilePath= await req.file.data;
//   csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     console.log("fileData", jsonObj);
// })
// })


app.post('/test', async (req, res)=>{
  console.log(req.files.avatar);
  console.log("file path is", req.files.avatar.tempFilePath)
   const csvFilePath= await req.files.avatar.tempFilePath;
    csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
      console.log("fileData", jsonObj);
  })
})
app.listen(process.env.PORT || 5000, () => console.log('server is listening on 5000...'));
