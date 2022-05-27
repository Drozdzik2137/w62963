const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config/db')

// Secret key to HS512 algorithm
const secret = `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9MIIEvAIBADAN
BgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFyaHWy/UMczYsXI8+RGyQQKBg
fVxZkpasQOSNUT/0C3c0gtPWCHgG3LInbLCw9uLoJl8ZKHaAS2wkFhGFKZOJ8vn9
cQrGYQFFWHVdnyMT7LLaZYpfTt6OVT/m3myl4aUytVBwwXp9+pVO9w4I/cGQwVrq
XwuXTChm7HiBHVozweejT3bLb2fPexYelK97++tzFkMKIHn7Zv46TEYJONPHOqGz
yTyCgy42yu1pxLzSufMffrmGEJt17K4WzmP8uZmKOTX9+NR5MlvvYBJqYmlzjGl4
lsJlspVlTj29LW9u8AZDjtUKe3Wckg+4JXEYgKSgywT2N0QWo0QdTKXxMOx6mJ5O
xVjG89eLAgMBAAECggEAR4HkfxHyIHQu69rO3pt+2fwEJYtwgbz7dgKur70UF/cG
efZz0ycPVjs5OpFEdpHOISXRY8FqU/+CnjyWVq6PlRCsLhLwza1P5GG9q0OKdw8f
MUrNIRP5c+HVmU56CL3l6UysyFdl+f3N7to6CJNCMCPiVVvVVs0OAB8kpdw7Pelx
WIwwJCZ4m15a2fl9OCtT3RVaoc+17xA8GO/rcLqjnnpD4hk8cibUunkA/PEZyJ9u
qtsei4aBDCyu6Q/JInW1/aDoLU/n64hlfdJjFR/1H0JPJaV++xm0ia/JzlHgDPGI
L1MsLLd+Vzx6DOflrNywVa2Yhh78qffo7XI8+RGyQQKBgQDuDx2dQOM401kyu1GQ
oErktc4IfZpoGf8IbrxIPwhepURIag3sn7LvPirAP8ZC55utYMIKRWeoWFoAzlSp
VbbzL/EiJTMcdONusRh4co43vjmJU9Bd9jUIRNtafA41mxFDwn8vOPgCchjEcG9c
txk/WGJC78bc0DQFNBHckNjL+wKBgQDUsY7gcL6ft8zmjlWmwtkRlSl409T2zsSW
FJ//jtm8FjolM0K/DGuSvmk4ls3T8gcx0y3k065g7URIP3ORbqZtcazOiVaShDiP
L7xW9qy3CQo4VYUJr5wH1WGmydrCeKMe+LQHDhq4MaXbNJNNNR32ItQQB9Zgu051
/zO6qxw9sQKBgEMvgOwgpAAlpcbrltl6Y6iopr0+tZUrwQ5gMkMxhusvOVY2mDdv
2tAqe2ZGmW3Ib+c+p4S+kcKxLLWNhddEmZ2IqkU4unQNiSJ0WLOloP2aciKPxP6/
vbfXtxCScnAuk3DMM5jgOx51lQfbs5I3GqkGCLVbdoRbPlM5ntDhEE6BAoGAQaha
SdCkF9v+ZcHUkPkfVz0ro0AJQvNLXmUZiyOG9XgLFQbA+QcVgiRDiROMkHvrWqct
SLFL6GH2LTNhMqjsuWZZCRz+W5Zze0gqJNJbONmSjRdhTT8ntIdbcMhpPpVNDbeK
o47oEqpI3+VX/4KBMEVKH3S76fqIWwaf6mT9/9ECgYBbbx5Gn59891WpC3/Q6aJV
y8YEhwXP8JPPKCr+MM98N22vEudgh60rgVBag+3DvgW4PasOLnI4xW2O3WUsbtqN
x02bk6OFlWGSZbGdGXVskY+y4E9GsMKv2igdEYRUbKpOW/0i8J5yvEtJ12G8PL94
eT4PC5ZjvEabzob4WHiy0w`

module.exports = {
    secret: secret,
    // validJWTNeeded: (req, res, next) => {
    //     if (req.headers['authorization']) {
    //         try {
    //             let authorization = req.headers['authorization'].split(' ')
    //             if (authorization[0] !== 'Bearer') {
    //                 console.log("brak tokenu")
    //                 return res.status(404).json({message: "Brak tokenu"})
    //             } else {
    //                 req.jwt = jwt.verify(authorization[1], secret, (err, data) => {
    //                     if(err){
    //                         return res.status(404).json({message:"Token niepoprawny"})
    //                     }else{
    //                         return next()
    //                     }
    //                 })
    //             }
    //         } catch (err) {
    //             return res.status(404).json({message: "Autoryzacja nieudana"})
    //         }
    //     } else {
    //         return res.status(404).json({message: "Nie znaleziono tokenu."})
    //     }
    // },    
    hasAuthFields: (req, res,next) => {
        let errors = [];
        if(req.body) {
            if(!req.body.email){
                errors.push('Uzupełnij pole login')
            }
            if(!req.body.password){
                errors.push('Uzupełnij pole hasło')
            }
            if(errors.length == 1){
                return res.status(404).json({message: errors[0]})
            }
            if(errors.length == 2){
                return res.status(404).json({message: 'Uzupełnij pole login i hasło'})
            }else{
                return next()
            }
        }else{
            return res.status(404).json({message: 'Uzupełnij pole login i hasło'})
        }
    },
    isPasswordAndUserMatch: async (req,res,next) => {
        try{
            const userPassowrd = req.body.password;
            const userEmail = req.body.email;

            const client = await pool.connect()

            const {rows} = await client.query(`SELECT 
            id, 
            email, 
            password, 
            fname, 
            lname, 
            photo_url, 
            is_admin, 
            type, 
            created_at,
            phone_number
            FROM public."user"
            WHERE email ILIKE $1`, ['%' + userEmail + '%'])
            client.release()            

            if(rows){
                const match = await bcrypt.compare(userPassowrd, rows[0].password)
                if(match){
                    //req.body = rows[0];
                    req.userId = rows[0].id
                    req.email = rows[0].email
                    req.fname = rows[0].fname
                    req.lname = rows[0].lname
                    req.photoUrl = rows[0].photo_url
                    req.type = rows[0].type
                    req.isAdmin = rows[0].is_admin
                    req.createdAt = rows[0].created_at
                    req.phoneNumber = rows[0].phone_number
                    next();
                }else{
                    res.status(404).json({message: "Login lub hasło nieprawidłowe"})
                }
            } else{
                res.status(404).json({message: "Logowanie zakończone niepowodzeniem"})
            }

        }catch(err){
            res.status(404).json({message: "Login lub hasło nieprawidłowe"})
        }
    }
}