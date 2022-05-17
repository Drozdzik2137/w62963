const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config/db')

const secret = `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9`

module.exports = {
    secret: secret,
    hasAuthFields: (req, res,next) => {
        let errors = [];
        if(req.body) {
            if(!req.body.email){
                errors.push('Uzupełnij pole login')
            }if(!req.body.password){
                errors.push('Uzupełnij pole hasło')
            }if(errors.length == 1){
                return res.status(404).json({message: errors[0]})
            }if(errors.length == 2){
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
            created_at
            FROM public."user"
            WHERE email ILIKE $1`, ['%' + userEmail + '%'])

            if(rows){
                const match = await bcrypt.compare(userPassowrd, rows[0].password)
                if(match){
                    //req.body = rows[0];
                    req.email = rows[0].email;
                    req.fname = rows[0].fname;
                    req.lname = rows[0].lname;
                    req.photoUrl = rows[0].photo_url;
                    req.type = rows[0].type;
                    req.isAdmin = rows[0].is_admin;
                    req.userId = rows[0].id;
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