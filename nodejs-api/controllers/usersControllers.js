const pool = require('../config/db')

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
