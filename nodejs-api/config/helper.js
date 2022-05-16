const jwt = require('jswonwebtoken')
const bcrypt = require('bcrypt')

const secret = `MIICXAIBAAKBgFs9ZtsmrrEDc/+N7NNDWKS61O6YVPie98SkEKMYf6hGsar6ycRC
/ssZCFZVpbdcAUuROFIda/XBxMXdiWJBNjYvlE79Ay20+n3gNr6OuG3klhjLHgwv
O+YMutiHQukCDdPszMJiQ8bEU+OS5dCScQDKOYE6xnaRBOj5KNL1f2OzAgMBAAEC
gYAGQmAcCLtTSXlbvtDQbX5XTrns5GZv5/f3dYnupm+bi74EjM/qtu3j4QPBaH7F
5XnxRTUn7PzLD1AAgwI5y198ovmaBRm6wxdTkNdNTmvWBX8GrJ202cVXfANppOQJ
Qgl+/g8HTRNpQ1bxfDiY1CQZQ3NJHnwKMqoBjAzfjiqsAQJBAK/o3aJs+vEQ+ZGS
Lq1HaQZJ+cyf0RRjaUqGY7XSf/JhvBPGI+hZNILXvGuK+PVWciBdCn+3DKzebA4S
kQaxuZMCQQCEx9sbgxMPaK6pIJFgdyStuam4GByddDPMhE4U/NCStDvb3yO1bziX
HDhIfSyGgL2bey2/UlXsHDoRcLMu54FhAkEAhWrOvqR9Z10CjEAdGttwco6k4WfN
QfNsJlPrSDoRRJqP9UdwcIdH5n0NsVtEG3+nK5iln9wLxwkjV0EJsdQV9QJAIyTK
p3N/3fo1EGqgT8n5GUok06b+G+aftyflisSHZ+zwUveyedkgP06mzvjiig8VIEvw
Bc2DFGU8MVWE94sqwQJBAK/YVNSNIavWn21TBqtm8Yg4RAYvCDRBfkKK7XS/PqBA
ahspWe8VmA7fE9UgMGSehFNvYmr04X+2iMhJL0Jhdhg`

module.exports = {
    secret: secret,
    hasAuthFields: (req, res,next) => {
        let errors = [];
        if(req.body) {
            if(!req.body.email){
                errors.push('Uzupełnij pole login')
            }
            if(!req.body.password){
                errors.push('Uzupełnij pole hasło')
            }

            if(errors.length){
                return res.status(404).send({message: 'Uzupełnij pole login i hasło'})
            }else{
                return next()
            }
        }else{
            return res.status(404).send({message: 'Uzupełnij pole login i hasło'})
        }

    }
}