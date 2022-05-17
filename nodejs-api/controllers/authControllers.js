const pool = require('../config/db')
const helper = require('../config/helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req,res) => {
    try{
        let token = jwt.sign({state: 'true', email: req.body.email}, helper.secret, {
            algorithm: 'HS512',
            expiresIn: '10min',
        })
        res.json({
            token: token,
            auth: true,
            email: req.email,
            fname: req.fname,
            lname: req.lname,
            photoUrl: req.photoUrl,
            userId: req.userId,
            type: req.type,
            isAdmin: req.isAdmin
        })


    }catch(e){
        res.status(404).json({msg: 'Error 404'})
        console.error(e.message)
    }
}