const pool = require('../config/db')
const bcrypt = require('bcrypt')
const e = require('express')

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
        if(userId !== undefined){
            let lname = req.body.lname
            let fname = req.body.fname
            let oldPassword = req.body.oldPassword
            let newPassword = req.body.newPassword
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
            }else if(oldPassword !== undefined && newPassword !== undefined){
                const {rows} = await client.query(`SELECT 
                password
                FROM public."user"
                WHERE id=${userId}`)
                if(rows){
                    const match = await bcrypt.compare(oldPassword, rows[0].password)
                    if(match){
                        let newPasswordHash = await bcrypt.hash (newPassword, 10);
                        const {rows} = await client.query(`UPDATE 
                        public."user"
                        SET  password='${newPasswordHash}'
                        WHERE id=${userId}
                        RETURNING id`)
                        const updatedPassId = rows[0].id
                        if(updatedPassId > 0){
                            res.status(200).json({message: 'Zaktualizowano pomyślnie hasło'})
                        }else{
                            res.status(404).json({message: 'Nieudana zmiana hasła.'})
                        }
                    }else{
                        res.status(404).json({message: 'Hasło nie zgadza się!'})
                    }
                }else{
                    res.status(404).json({message: 'Brak użytkownika'})  
                }    
            }else{
                res.status(404).json({message: 'Brak danych, spróbuj jeszcze raz'})
            }
            client.release() 
        }else{
            res.status(404).json({message: 'Bład ID użytkownika'})
        }
    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.error(err.message)
    }
}

exports.deleteUser = async (req, res) => {
    try{
        let userId = req.params.id
        if(userId !== undefined){
            const client = await pool.connect()

            const {rows} = await client.query(`DELETE 
            FROM 
            public."user"
            WHERE id=${userId}
            RETURNING id`)
            let deletedUserId = rows[0].id
            if(deletedUserId > 0){
                res.status(200).json({message: 'Przykro nam, że nie spełniliśmy twoich oczekiwań'})
            }else{
                res.status(404).json({message: 'Nieudana próba usunięcia konta.'})
            }
            client.release() 
        }else{
            res.status(404).json({message: 'Bład ID użytkownika'})
        }
    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.error(err.message)
    } 
}
