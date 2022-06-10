const pool = require('../config/db')
const { connect } = require('../routes/auth')

exports.getAllOrders = async (req, res) => {
    try{
        const client = await pool.connect()
        console.log('Podłączono do bazy z routa all orders')

        const {rows} = await client.query(`SELECT
        "order".id,
        "user".email,
        "user".phone_number,
        "order".status,
        "order".created_at
        FROM "order"
        JOIN "user" ON "user".id = "order".user_id
        ORDER BY created_at DESC`)
        res.status(200).json({
            count: rows.length,
            orders: rows
        })
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.changeOrderStatus = async (req, res) => {
    try{
        const orderId = req.params.id
        if(orderId > 0){
            const newStatus = req.body.orderStatus
            if(newStatus !== undefined){
                const client = await pool.connect()
                const {rows} = await client.query(`UPDATE 
                public."order"
                SET status='${newStatus}'
                WHERE id=${orderId}
                RETURNING id`)
                client.release()
                const updatedOrderId = rows[0].id
                if(updatedOrderId > 0){
                    res.status(200).json({message: 'Pomyślnie zmieniono status'})
                }else{
                    res.status(404).json({message: 'Błąd zmiany statusu'})
                }
            }else{
                res.status(404).json({message: 'Błąd nowego statusu'})
            }
        }else{
            res.status(404).json({message: 'Brak ID zamówienia'})
        }
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.getSingleOrder = async (req, res) => {
    try{
        const client = await pool.connect()
        console.log('Podłączono do bazy z routa single order')

        const orderId = req.params.id
        
        const {rows} = await client.query(`SELECT 
        "order".id as order_id,
        brand.name as brand,
        product.id,
        product.img,
        product.size,
        product.freshness,
        product.name,
        product.price,
        order_details.quantity,
        "order".created_at,
        "order".total,
        "order".status,
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
            res.status(200).json(rows)
        }else{
            res.status(404).json({message: `Nie znaleziono zamówienia z ID: ${orderId}`})
        }
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.getSingleOrderTotal = async (req, res) => {
    try{
        const client = await pool.connect()

        const orderId = req.params.id
        
        const {rows} = await client.query(`SELECT
        "order".total
        FROM "order"
        WHERE "order".id=${orderId}`)
        client.release()
        if(rows.length > 0){
            res.status(200).json(rows[0].total)
        }else{
            res.status(404).json({message: `Nie znaleziono zamówienia z ID: ${orderId}`})
        }  
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.newOrder = async (req, res) => {
    try{
        const client = await pool.connect()
        let {userId, products, total} = req.body
        if(userId !== null && userId > 0){
            const newOrder = await client.query(`INSERT INTO 
            "order" (user_id, total, status)
            VALUES (${userId}, ${total}, 'Złożono zamówienie')
            RETURNING id`)
            const insertedId = newOrder.rows[0].id
            if(insertedId > 0){
                try{
                    async function searchProducts(){
                        let getError = false;

                        for(const p of products){
                            let data = await client.query(`SELECT
                            product.quantity
                            FROM product
                            WHERE id=$1`, [p.id])
        
                            let dataQuantity = data.rows[0].quantity
                            let inCart = parseInt(p.inCart)
                            // Deduct the number of pieces ordered from the quantity column in database
                            if(dataQuantity > 0){
                                if(inCart > dataQuantity){
                                    const delOrder = await client.query(`DELETE 
                                    FROM 
                                    public."order"
                                    WHERE id=${insertedId};
                                    `)
                                    const delOrderDetails = await client.query(`DELETE 
                                    FROM 
                                    public.order_details
                                    WHERE order_id=${insertedId};`)
                                    getError = true
                                    break
                                }else{
                                    dataQuantity = dataQuantity - inCart
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
                                }
                            }else{
                                const delOrder = await client.query(`DELETE 
                                FROM 
                                public."order"
                                WHERE id=${insertedId};
                                `)
                                const delOrderDetails = await client.query(`DELETE 
                                FROM 
                                public.order_details
                                WHERE order_id=${insertedId};`)
                                getError = true
                                break
                            }    
                        }
                    client.release()
                    if(getError == false){
                        res.status(200).json({
                            message: `Zamówienie zostało pomyślnie złożone.`,
                            success: true,
                            order_id: insertedId,
                            products: products
                        })
                    }else{
                        res.json({message: `Utworzenie nowego zamówienia z podanymi danymi nie powiodło się`, success: false})
                    }
                    }
                    searchProducts()
                }catch(e){
                    throw e
                }
            }
        }else{
            res.status(404).json({message: `Brak informacji o użytkowniku i zamówieniu`, success: false})
        }
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.payment = async (req, res) => {
    try{
        setTimeout(() => {
            res.status(200).json({success: true})
        }, 1000)

    }catch(e){
        res.status(404).json({message: 'Error 404', success: false})
        console.error(e.message)
    }
}

exports.getUserOrders = async (req, res) => {
    try{
        let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
        const offset = (page - 1) * limit
        let userId = req.params.id


        const client = await pool.connect();
        const countQuery = await client.query(`SELECT 
        COUNT(*) as count
        FROM 
        public."order"
        WHERE user_id=${userId}`)
        const numOfOrders = countQuery.rows[0].count
        const numOfPages = Math.ceil(numOfOrders / limit)
        const orderType = (req.query.orderType != undefined && ["ASC", "DESC"].includes(req.query.orderType.toUpperCase())) ? req.query.orderType : "DESC"

        const {rows} = await client.query(`SELECT 
            "order".id,
            "user".email,
            "user".id as userId,
            "order".created_at,
            "order".total,
            "order".status
            FROM "order"
            JOIN "user" ON "user".id = "order".user_id
            WHERE "user".id=${userId}
            ORDER BY created_at ${orderType}
            LIMIT ${limit}
            OFFSET ${offset}`)

        res.status(200).json({
            count: rows.length,
            limit: limit,
            totalOrders: numOfOrders,
            totalPages: numOfPages,
            currentPage: page,
            orders: rows
        })
        client.release()

    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.log(err.message)
    }

}


