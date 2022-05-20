const express =require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('dotenv').config()

// Konfiguracja middleware
const app = express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}))

const port = process.env.PORT || 4000
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())

// Import Router
const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

// Use Routes
app.use('/api/', productsRouter)
app.use('/api/', ordersRouter)
app.use('/api/', authRouter)
app.use('/api/', usersRouter)

// Nasłuch
app.listen(port, () => {
    console.log(`Nasłuch na porcie ${port}`)
})
