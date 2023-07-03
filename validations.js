import { body } from "express-validator";

export const loginValidation = [
  body("email", "mail ucun duzgun format deyil").isEmail(),
  body("password", "sifre minimum 5 herfden ibaret olmalidir").isLength({
    min: 5,
  }),
];
export const registerValidation = [
  body("email", "mail ucun duzgun format deyil").isEmail(),
  body("password", "sifre minimum 5 herfden ibaret olmalidir").isLength({
    min: 5,
  }),
  body("fullName", "adi daxil edin").isLength({ min: 3 }),
  body("avatarUrl", "avatarda     dogru link secilmeyib").optional().isURL(),
  
// Aciqlamasi beledir: 1- menim bodym de sorgu gedirse axtarir eger yazdigimiz email deyilse, express-validator melumat verir
// Sifrede ise ehtiyyac yoxdur.

];


export const postCreateValidation = [
  body("title", "məqalə başlıqlarını çap edin").isLength({ min: 3 }).isString(),
  body("text", "məqalənin mətnini göstərin").isLength({ min: 3 }).isString(),
  body("tags", "yanlış formatdır (massivi kapla)").optional().isString(),
  body("imageUrl", "Yanlış şəkil linki").optional().isString(),
];

// Aciqlamasi beledir: 1- menim bodym de sorgu gedirse axtarir eger yazdigimiz email deyilse, express-validator melumat verir
// Sifrede ise ehtiyyac yoxdur.
