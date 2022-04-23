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
const productsRouter = require('./routes/products.js')

// Use Routes
app.use('/api/', productsRouter)

// Nasłuch
app.listen(port, () => {
    console.log(`Nasłuch na porcie ${port}`)
})
