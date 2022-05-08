const pool = require('../config/db')

exports.getAllOrders = async (req, res) => {
    try{
        const client = await pool.connect()
        console.log('Podłączono do bazy z routa all orders')

        const {rows} = await client.query(`SELECT
        "order".id,
        brand.name as brand,
        product.name,
        product.price,
		order_details.quantity,
        "user".email
        FROM "order"
        JOIN order_details ON order_details.order_id = "order".id
        JOIN product ON product.id = order_details.product_id
		JOIN brand ON product.brand_id = brand.id
        JOIN "user" ON "user".id = "order".user_id
        ORDER BY "order".id ASC`)
        res.status(200).json(rows)
        client.release()
    }catch(e){
        res.status(404).json({msg: 'Error 404'})
        console.error(e.message)
    }
}

exports.getSingleOrder = async (req, res) => {
    try{
        const client = await pool.connect()
        console.log('Podłączono do bazy z routa single order')

        const orderId = req.params.id
        
        const {rows} = await client.query(`SELECT 
        "order".id,
        brand.name as brand,
        product.name,
        product.price,
        order_details.quantity,
        "user".email,
        product.img
		FROM "order"
		JOIN order_details ON order_details.order_id = "order".id
        JOIN product ON product.id = order_details.product_id
		JOIN brand ON product.brand_id = brand.id
        JOIN "user" ON "user".id = "order".user_id
        WHERE "order".id=$1`, [orderId])
        client.release()
        if(rows.length > 0){
            res.status(200).json(rows[0])
        }else{
            res.status(404).json({msg: `Nie znaleziono zamówienia z ID: ${orderId}`})
        }
    }catch(e){
        res.status(404).json({msg: 'Error 404'})
        console.error(e.message)
    }
}

exports.newOrder = async (req, res) => {
    try{
        const client = await pool.connect()
        let {userId, products} = req.body
        if(userId !== null && userId > 0){
            const newOrder = await client.query(`INSERT INTO 
            "order" (user_id)
            VALUES ($1)
            RETURNING id`, [userId])
            const insertedId = newOrder.rows[0].id
            if(insertedId > 0){
                products.forEach(async (p) =>{
                    let data = await client.query(`SELECT
                    product.quantity
                    FROM product
                    WHERE id=$1`, [p.id])

                    let dataQuantity = data.rows[0].quantity
                    let inCart = parseInt(p.inCart)
                    // Deduct the number of pieces ordered from the quantity column in database
                    if(dataQuantity > 0){
                        dataQuantity = dataQuantity - inCart
                        if(dataQuantity < 0){
                            dataQuantity = 0
                        }
                    }else{
                        dataQuantity = 0
                    }

                    // Insert order details the new generated order id
                    const newOrderDetails = await client.query(`INSERT INTO 
                    order_details(order_id, product_id, quantity)
                    VALUES ($1, $2, $3)
                    RETURNING id`,
                    [insertedId, p.id, inCart])
                    if(newOrderDetails.rows[0].id > 0){
                        const updateProductQuantity = await client.query(`UPDATE 
                        product
                        SET quantity=$1
                        WHERE id=$2
                        RETURNING id, quantity`, [dataQuantity, p.id])
                    }
                })
            }else{
                res.json({message: `Utworzenie nowego zamówienia z podanymi danymi nie powiodło się`, success: false})

            }
            client.release()
            res.status(200).json({
                message: `Zamówienie zostało pomyślnie złożone. ID zamówienia: ${insertedId}`,
                success: true,
                order_id: insertedId,
                products: products
            })
        }

    }catch(e){
        res.status(404).json({msg: 'Error 404'})
        console.error(e.message)
    }
}

exports.payment = async (req, res) => {
    try{
        setTimeout(() => {
            res.status(200).json({success: true})
        }, 3000)

    }catch(e){
        res.status(404).json({msg: 'Error 404'})
        console.error(e.message)
    }
}


