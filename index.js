
import 'dotenv/config'


import express from "express";
import multer from "multer";
import mongoose from "mongoose";

import cors from  'cors'

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import {handleValidationErrors, CheckAuth} from "./utils/index.js";

import  {UserController, PostController} from "./Controllers/index.js";

console.log('process.env.MONGODB_URI');
console.log(process.env.MONGODB_URI);
console.log('process.env.MONGODB_URI');
mongoose
  .connect(
   process.env.MONGODB_URI
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();


////////////////////////////////////////////////////////////////////
// Burada biz butun sekil ve fayllari saxlayacagiq
const storage = multer.diskStorage({
  // Men deyirem ki ne vaxt ki saxladiqarim anbari yaranacaq
  // Sen destination funksiyanisini yerine yetirmelisen
  //Bu funksiya mene demelidir ki bu hec bir xeta cixarmir
  //Ve aydin edir ki lazimdi saxranit edesen bu fayli hansi ki yukleyeceysen papka uploaddan
  //  BU funksiya bize onu gosterir ki hansi yolu istifade etmey lazimdir
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename:(_, file, cb) => {
    cb(null, file.originalname);
  }, 

  //Ne vaxt ki luboy fayl yuklenmeye baslayanda birinci funksiya heyata kececek hansi ki faylin yolunu qaytarir
  // Soram hansi fayli ki saxranit eledin faylin adi nedir onu gosterir
});

////////////////////////////////////////////////////////////////////////

//daha sonra onu expere preminit edirik
const upload = multer({storage})

app.use(express.json());
app.use(cors()); 
//Bu funksiyaynan expresse bildiririk ki bu filede olan sekil 
// Xususi bir papkaya aittir ve orada saxlanilir
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
/// Login ve Register meselesini hell etdikden sonra kecirik nobeti addima
// Bu request bize bir növ gizli məlumatı qaytarmaq mümkündürmü? mumkun deyil mi ? onu gosterir
app.get("/auth/me", CheckAuth, UserController.getMe);

app.post('/upload',CheckAuth,  upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags)
 console.log(PostController.getAll);
app.get("/posts", PostController.getAll);
app.get('/posts/tags',PostController.getLastTags)
app.get("/posts/:id", PostController.getOne);
// Qorunan routerler burada yaziriq
//CheckAuth ona gore yaziriq ki avtorizatsiyani yoxlasin deye.
app.post("/posts", CheckAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", CheckAuth, PostController.remove);
app.patch("/posts/:id", CheckAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});

