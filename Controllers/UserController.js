import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


import UserModal from "../models/user.js";

export const register = async (req, res) => {
    try {
     
  
      // biz ilk novbede passwordu(parolu)  request edib ortaya cixarmaliyiq
      // daha sonra await vasitesi ile salti olusdururuq. Bir nov parolu sifrelemek ucun istifade edilir.
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash  = await bcrypt.hash(password, salt);
  
      const doc = new UserModal({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash
      });
  
      // Mongo DB (data base) bize sonuc gonderennen sora biz ona useri gonderirik bu sekilde
      const user = await doc.save();
  
      
  
      /* 
       -  Bir registr etdikden sonra eger hec bir error yoxdursa, biz hash la parolumuzu sifreleye bildik,
       -  Documenti yaratdiq,
       -  Ve dakument yaranandan sonra onu baza dataya otururuk,
       -  Oturdukden sonra jwt tokenle biz butun umumi melumatlarimizi sifreleyeceyik
        */
  
      const token = jwt.sign(
      // Biz  istifadəçi məlumatlarını qaytarmalıyıq bu usulla
      //User melumatlarini jwt vasitesi ile sifreleyirik
      //tokeni sifreleyirik
        {
          _id: user._id,
        },
        "secret123",
        {
          //Burada ise menim tokenimin muddetin yaziriq. Nece muddete qorunacaq misal(srok)
          expiresIn: "30d",
        }
      );
     // passwordHash gorunmesin deye yigisdirma metodu
      const {passwordHash, ...userData} = user._doc
  
      res.json({
        ...userData._doc,
        token,
      });
    } catch (err) {
      res.status(500).json({
        message: "Qeydiyyatdan keçmək alınmadı",
      });
    }
  }


  export const login = async (req, res) => {
    try {
        // Istifadecini tapmaq lazimdir, daha sonra 
        // mene tap baza data'dan request body emaili
        const user = await UserModal.findOne({email: req.body.email});

        //Eger yoxdursa sert yaziriq ki istifadeci tapilmadi yada Melumat tapilmadi
        if(!user) {
            return res.status(404).json({
                message:  'Melumat tapilmadi!'
            })
        }

        // Eger bizim istifadecilerin melumatlari cagirdigimiz requestle ust uste dusdu ve dogrulandisa
        // O zaman  'bcrypt' muqayise et ki 'compare() ' gonderdiyim iki parametr ki var req.body.password ve user._doc.passwordHash
        // Bu iki parametrli muqayise etdikden sonra eger bir birine beraberdirlerse islesin 
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        //eger bir birine beraber deyillerse 
        if(!isValidPass) {
            return res.status(400).json({
                message:  'Login ve ya sifre melumatlarini dogru qeyd etmemisiniz'
            });
        }
        const token = jwt.sign(
            // Biz  istifadəçi məlumatlarını qaytarmalıyıq bu usulla
            //User melumatlarini jwt vasitesi ile sifreleyirik
            //tokeni sifreleyirik
              {
                _id: user._id,
              },
              "secret123",
              {
                //Burada ise menim tokenimin muddetin yaziriq. Nece muddete qorunacaq misal(srok)
                expiresIn: "30d",
              }
            );

            const {passwordHash, ...userData} = user._doc

            res.json({
              ...userData,
              token,
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: ' icaze(authorization) ugursuz icaze',
        })
    }
}


export const getMe = async(req, res) => {
    try {
        const user = await UserModal.findById(req.userId);
         
        if(!user){
            return res.status(404).json({
                message: 'Melumat tapılmadı'
            }); 
        }
        const {passwordHash, ...userData} = user._doc

    res.json({userData
    });
    } catch (err) {
        res.status(500).json({
            message: "Giris yoxdur!",
          });
    }
}