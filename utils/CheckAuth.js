import  jwt  from "jsonwebtoken";

export default(req, res, next) => {
    // /biz onu təhlil edib daha da deşifrə etməliyik
   // token funksiyasi yaradaraq req edib  headersden authorization nu  aliriq 

   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
;

   if(token) {
    //Eger token varsa onu sifreleyirik
try {
    const decoded = jwt.verify(token, 'secret123');
  
    req.userId = decoded._id
    next(); // Eger men tokeni sifreledimse, userId'de yaddasda saxladimsa 
            // Men demeliyem fso her sey qaydasindadir, o zaman diger funksiyani yerine yetir
} catch (error) {
    return res.status(403).json({
        message: 'Giriş yoxdur',
    });
}
   } else {
    //Token toxdursa
  return   res.status(403).json({
        message: 'Giriş yoxdur'
    });
   }

};