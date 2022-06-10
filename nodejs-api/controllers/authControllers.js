const pool = require('../config/db')
const helper = require('../config/helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Login logic
exports.login = async (req, res) => {
    try{
        const accessToken = jwt.sign({state: 'true', id: req.userId, email: req.body.email, isAdmin: req.isAdmin}, helper.secret, {
            algorithm: 'HS512',
            expiresIn: '30d'
        })

        // res.cookie('SESSIONID', accessToken, {
        //     httpOnly: true,
        //     secure: true,
        // })


        res.status(200).json({
            token: accessToken,
            auth: true,
            userId: req.userId,
            email: req.email,
            fname: req.fname,
            lname: req.lname,
            photoUrl: req.photoUrl,
            type: req.type,
            isAdmin: req.isAdmin,
            createdAt: req.createdAt,
            phoneNumber: req.phoneNumber
        })


    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

// Register logic
exports.register = async (req,res) => {
    try{
        let errors = [];
        if(req.body){
            if(!req.body.email){
                errors.push('Uzupełnij pole email!')
            }
            if(!req.body.password){
                errors.push('Uzupełnij pole hasło!')
            }
            if(errors.length == 1){
                return res.status(404).json({message: errors[0]})
            }
            if(errors.length == 2){
                res.status(404).json({message: 'Uzupełnij pola email i hasło!'})
            }else{
                const userRegisterEmail = req.body.email
                const client = await pool.connect()

                const {rows} = await client.query(`SELECT
                email
                FROM public."user"
                WHERE email ILIKE $1`, ['%' + userRegisterEmail + '%'])

                if(rows.length > 0){
                    res.status(404).json({message: 'Podany adres email jest już zajęty!'})
                }else{
                    const email  = req.body.email
                    const password = await bcrypt.hash(req.body.password, 10)
                    const fname = req.body.fname
                    const lname = req.body.lname
                    const type = req.body.type
                    const phone_number = req.body.phoneNumber
                    const photo_url = req.body.photoUrl == null ? 'https://via.placeholder.com/800' : req.body.photoUrl

                    /* 'type' types
                       local - normal register
                       social - possible in the future => like google auth 
                    */

                    // isAdmin default is false (autoconfig in database)

                    const {rows} = await client.query(`INSERT INTO
                    public."user"
                    (email, password, fname, lname, photo_url, type, phone_number)
                    VALUES ('${email}', '${password}', '${fname}', '${lname}', '${photo_url}', '${type || 'local'}', '${phone_number}')
                    RETURNING id`)
                    client.release()
                    const insertedId = rows[0].id
                    if(insertedId > 0){
                        res.status(200).json({message: 'Rejestracja przebiegła pomyślnie. Konto zostało utworzone!'})
                    }else{
                        res.status(404).json({message: 'Nieudana rejestracja.'})
                    }
                }

            }
        }else{
            res.status(404).json({message: 'Uzupełnij wszystkie pola!'})
        }

    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }

}