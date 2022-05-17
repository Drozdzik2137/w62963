const express =require('express')
const cors = require('cors')

require('dotenv').config()

// Konfiguracja middleware
const app = express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
}))

const port = process.env.PORT || 4000
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Import Router
const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')

// Use Routes
app.use('/api/', productsRouter)
app.use('/api/', ordersRouter)
app.use('/api/', authRouter)

// Nasłuch
app.listen(port, () => {
    console.log(`Nasłuch na porcie ${port}`)
})
