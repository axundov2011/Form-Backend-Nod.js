import { validationResult } from "express-validator"; //  formu yaradarken errorun cixib cixmadigini yoxlayir

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }


    //Eger xeta yoxdursa diger qarsidaki funksiyani islet
    next();
}