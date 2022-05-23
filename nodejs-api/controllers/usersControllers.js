const pool = require('../config/db')
const bcrypt = require('bcrypt')

exports.user = async (req,res) =>{
    try{
        if(!req.params.id){
            res.status(404).json({message: 'Nieprzekazane ID użytkownika'})
        }else{
            const userId = req.params.id
            
            const client = await pool.connect()
            
            const {rows} = await client.query(`SELECT 
            id, 
            email, 
            fname, 
            lname, 
            photo_url, 
            is_admin, 
            type, 
            created_at
            FROM public."user"
            WHERE id=${userId}`)
            client.release()  

            res.status(200).json({
                userId: rows[0].id,
                email: rows[0].email,
                fname: rows[0].fname,
                lname: rows[0].lname,
                photoUrl: rows[0].photo_url,
                isAdmin: rows[0].is_admin,
                type: rows[0].type,
                createdAt: rows[0].created_at
            })
            
        }
    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.error(err.message)
    }
}

exports.updateUserData = async (req, res) => {
    try{
        let userId = req.params.id
        let lname = req.body.lname
        let fname = req.body.fname
        let password = await bcrypt.hash(req.body.password, 10)
        const client = await pool.connect()

        if(lname !== undefined && fname !== undefined){
            const {rows} = await client.query(`UPDATE
            "user"
            SET fname='${fname}', lname='${lname}'
            WHERE "user".id=${userId}
            RETURNING fname, lname`)
            if(rows){
                res.status(200).json({message: 'Zakutalizowano pomyślnie dane'})
            }else{
                res.status(404).json({message: 'Nieudało się zaktualizować danych'})
            }
        }else if(password !== undefined){
            const {rows} = await client.query(`UPDATE
            "user"
            SET password='${password}'
            WHERE "user".id=${userId}`)
            if(rows){
                res.status(200).json({message: 'Hasło zaktualizowane pomyślnie'})
            }else{
                res.status(404).json({message: 'Nieudało się zaktualizować hasła'})
            }
        }else{
            res.status(404).json({message: 'Brak danych, spróbuj jeszcze raz'})
        }
        client.release() 
    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.error(err.message)
    }
}
