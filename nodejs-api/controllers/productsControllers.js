const pool = require('../config/db')

// exports.getProducts = async (req, res) => {
//     try{
//         const client = await pool.connect()
//         console.log("Podłączono do bazy z routa products")
        
//         let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
//         const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
//         const offset = (page - 1) * limit
//         const countQuery = await client.query(`SELECT COUNT(*) as count FROM product`)
//         const numOfProducts = countQuery.rows[0].count
//         const numOfPages = Math.ceil(numOfProducts / limit)

//         const {rows} = await client.query(`WITH RECURSIVE
//         cte AS(
//         SELECT id,parent_id,name
//         FROM category
//         where category.parent_id IS NULL
//         UNION ALL
//         SELECT
//         category.id,
//         category.parent_id,
//         concat(cte.name, ' > ', category.name)
//         FROM category,cte
//         WHERE cte.id = category.parent_id
//         )

//         SELECT
//         cte.name as tree_category,
//         product.id,
//         product.name,
//         product.img,
//         product.images,
//         product.price,
//         product.quantity,
//         product.shortdesc,
//         size.name as size,
//         category.name as category,
//         brand.name as brand
//         FROM PRODUCT
//         JOIN BRAND ON product.brand_id = brand.id
//         JOIN SIZE ON product.size_id = size.id
//         JOIN PRODUCT_CATEGORY ON product.id = product_category.product_id
//         JOIN CATEGORY ON product_category.category_id = category.id
//         JOIN CTE ON cte.id = product_category.category_id
//         ORDER BY name asc
//         LIMIT $1 
//         OFFSET $2`, [limit, offset])
//         res.status(200).json({
//             limit: limit,
//             count: rows.length,
//             totalProducts: numOfProducts,
//             currentPage: page,
//             totalPages: numOfPages,
//             products: rows
//         })
//         client.release()
//     }catch(e){
//         res.status(404).json({msg: 'Error 404'})
//         console.error(e.message)
//     }
// }

exports.getProducts = async (req, res) => {
    try{
        const client = await pool.connect()
        console.log("Podłączono do bazy z routa products")
        
        let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
        const offset = (page - 1) * limit
        const orderType = (req.query.orderType != undefined && ["ASC", "DESC"].includes(req.query.orderType.toUpperCase())) ? req.query.orderType : "ASC"
        const orderBy = (req.query.orderBy != undefined && (["brand", "price"].includes(req.query.orderBy.toLowerCase()))) ? req.query.orderBy : "brand"
        const countQuery = await client.query(`SELECT COUNT(*) as count FROM product`)
        const numOfProducts = countQuery.rows[0].count
        const numOfPages = Math.ceil(numOfProducts / limit)

        const {rows} = await client.query(`SELECT
        product.id,
        product.name,
        product.img,
        product.images,
        product.price,
        product.quantity,
        product.shortdesc,
        product.description,
        product.size,
        category.name as category,
        brand.name as brand
        FROM product
        JOIN brand ON product.brand_id = brand.id
        JOIN category ON product.category_id = category.id
        ORDER BY ${orderBy} ${orderType}
        LIMIT $1
        OFFSET $2`, [limit, offset])
        res.status(200).json({
            limit: limit,
            count: rows.length,
            totalProducts: numOfProducts,
            currentPage: page,
            totalPages: numOfPages,
            products: rows
        })
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

// exports.getNewProducts = async (req, res) => {
//     try{
//         const client = await pool.connect()
//         console.log("Podłączono do bazy z routa products")
        
//         const {rows} = await client.query(`WITH RECURSIVE
//         cte AS(
//         SELECT id,parent_id,name
//         FROM category
//         where category.parent_id IS NULL
//         UNION ALL
//         SELECT
//         category.id,
//         category.parent_id,
//         concat(cte.name, ' > ', category.name)
//         FROM category,cte
//         WHERE cte.id = category.parent_id
//         )

//         SELECT
//         cte.name as tree_category,
//         product.id,
//         product.name,
//         product.img,
//         product.images,
//         product.price,
//         product.quantity,
//         product.shortdesc,
//         size.name as size,
//         category.name as category,
//         brand.name as brand
//         FROM PRODUCT
//         JOIN BRAND ON product.brand_id = brand.id
//         JOIN SIZE ON product.size_id = size.id
//         JOIN PRODUCT_CATEGORY ON product.id = product_category.product_id
//         JOIN CATEGORY ON product_category.category_id = category.id
//         JOIN CTE ON cte.id = product_category.category_id
//         ORDER BY id DESC
//         LIMIT 4`)
//         res.status(200).json({
//             count: rows.length,
//             products: rows
//         })
//         client.release()
//     }catch(e){
//         res.status(404).json({msg: 'Error 404'})
//         console.error(e.message)
//     }
// }

exports.getNewProducts = async (req, res) => {
    try{
        const client = await pool.connect()
        console.log("Podłączono do bazy z routa new products")
        
        const {rows} = await client.query(`SELECT
        product.id,
        product.name,
        product.img,
        product.images,
        product.price,
        product.quantity,
        product.shortdesc,
        product.description,
        product.size,
        category.name as category,
        brand.name as brand
        FROM PRODUCT
        JOIN BRAND ON product.brand_id = brand.id
        JOIN CATEGORY ON product.category_id = category.id
        ORDER BY id DESC
        LIMIT 4`)
        res.status(200).json({
            count: rows.length,
            products: rows
        })
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

// exports.findProducts = async (req, res) => {
//     try{
//         console.log("Podłączono do bazy z routa find")
//         const client = await pool.connect()
//         let searchPhrase = req.body.searchInput
//         let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
//         const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
//         const offset = (page - 1) * limit
//         const countQuery = await client.query(`SELECT COUNT(*) as count
//         FROM product
//         WHERE product.name LIKE $1`, ['%' + searchPhrase + '%'])
//         const numOfProducts = countQuery.rows[0].count
//         const numOfPages = Math.ceil(numOfProducts / limit)

//         if(searchPhrase.length >= 2){
//             const {rows} = await client.query(`WITH RECURSIVE
//             cte AS(
//             SELECT id,parent_id,name
//             FROM category
//             where category.parent_id IS NULL
//             UNION ALL
//             SELECT
//             category.id,
//             category.parent_id,
//             concat(cte.name, ' > ', category.name)
//             FROM category,cte
//             WHERE cte.id = category.parent_id
//             )

//             SELECT
//             cte.name as tree_category,
//             product.id,
//             product.name,
//             product.img,
//             product.images,
//             product.price,
//             product.quantity,
//             product.shortdesc,
//             size.name as size,
//             category.name as category,
//             brand.name as brand
//             FROM PRODUCT
//             JOIN BRAND ON product.brand_id = brand.id
//             JOIN SIZE ON product.size_id = size.id
//             JOIN PRODUCT_CATEGORY ON product.id = product_category.product_id
//             JOIN CATEGORY ON product_category.category_id = category.id
//             JOIN CTE ON cte.id = product_category.category_id
//             WHERE product.name ILIKE $1
//             ORDER BY product.name asc
//             LIMIT $2 
//             OFFSET $3`, ['%' + searchPhrase + '%',limit, offset])
//             res.status(200).json({
//                 limit: limit,
//                 count: rows.length,
//                 totalProducts: numOfProducts,
//                 currentPage: page,
//                 totalPages: numOfPages,
//                 products: rows
//             })
//         }else{
//             res.json({msg: 'Nazwa szukanego produktu jest za krótka.'})
//         }
//         client.release()
//     }catch(e){
//         res.status(404).json({msg: 'Error 404'})
//         console.error(e.message)
//     }
// }

exports.findProducts = async (req, res) => {
    try{
        console.log("Podłączono do bazy z routa find")
        const client = await pool.connect()
        let searchPhrase = req.body.searchInput
        let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
        const offset = (page - 1) * limit
        const countQuery = await client.query(`SELECT COUNT(*) as count
        FROM product
        WHERE product.name LIKE $1`, ['%' + searchPhrase + '%'])
        const numOfProducts = countQuery.rows[0].count
        const numOfPages = Math.ceil(numOfProducts / limit)

        if(searchPhrase.length >= 2){
            const {rows} = await client.query(`SELECT
            product.id,
            product.name,
            product.img,
            product.images,
            product.price,
            product.quantity,
            product.shortdesc,
            product.description,
            product.size,
            category.name as category,
            brand.name as brand
            FROM PRODUCT
            JOIN BRAND ON product.brand_id = brand.id
            JOIN CATEGORY ON product.category_id = category.id
            WHERE product.name ILIKE $1
            ORDER BY product.name ASC
            LIMIT $2 
            OFFSET $3`, ['%' + searchPhrase + '%',limit, offset])
            res.status(200).json({
                limit: limit,
                count: rows.length,
                totalProducts: numOfProducts,
                currentPage: page,
                totalPages: numOfPages,
                products: rows
            })
        }else{
            res.status(404).json({message: 'Nazwa szukanego produktu jest za krótka.'})
        }
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

// exports.getSingleProduct = async (req, res, next) => {
//     try{
//         console.log("Podłączono do bazy z routa single product")
//         const client = await pool.connect()

//         let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
//         const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
//         const offset = (page - 1) * limit
//         const countQuery = await client.query(`SELECT COUNT(*) as count FROM product`)
//         const numOfProducts = countQuery.rows[0].count
//         const numOfPages = Math.ceil(numOfProducts / limit)

        
//         const {rows} = await client.query(`WITH RECURSIVE
//         cte AS(
//         SELECT id,parent_id,name
//         FROM category
//         where category.parent_id IS NULL
//         UNION ALL
//         SELECT
//         category.id,
//         category.parent_id,
//         concat(cte.name, ' > ', category.name)
//         FROM category,cte
//         WHERE cte.id = category.parent_id
//         )

//         SELECT
//         cte.name as tree_category,
//         product.id,
//         product.name,
//         product.img,
//         product.images,
//         product.price,
//         product.quantity,
//         product.shortdesc,
//         size.name as size,
//         category.name as category,
//         brand.name as brand
//         FROM PRODUCT
//         JOIN BRAND ON product.brand_id = brand.id
//         JOIN SIZE ON product.size_id = size.id
//         JOIN PRODUCT_CATEGORY ON product.id = product_category.product_id
//         JOIN CATEGORY ON product_category.category_id = category.id
//         JOIN CTE ON cte.id = product_category.category_id
//         WHERE product.id=$1`,[req.params.id])
//         res.status(200).json({
//             product: rows
//         })
//         client.release()
//     }catch(e){
//         res.status(404).json({msg: 'Error 404'})
//         console.error(e.message)
//     }
// }

exports.getSingleProduct = async (req, res) => {
    try{
        console.log("Podłączono do bazy z routa single product")
        const client = await pool.connect()
        
        const {rows} = await client.query(`SELECT
        product.id,
        product.name,
        product.img,
        product.images,
        product.price,
        product.quantity,
        product.shortdesc,
        product.description,
        product.size,
        category.name as category,
        brand.name as brand
        FROM PRODUCT
        JOIN BRAND ON product.brand_id = brand.id
        JOIN CATEGORY ON product.category_id = category.id
        WHERE product.id=$1`,[req.params.id])
        res.status(200).json(rows[0])
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

// exports.categories = async (req, res) => {
//     try{
//         console.log("Podłączono do bazy z routa categories")
//         const client = await pool.connect()

//         const {rows} = await client.query(`SELECT    c0.name  AS root_name,
//         c1.name  AS down1_name,
//         c2.name  AS down2_name,
//         c3.name  AS down3_name,
//         c4.name  AS down4_name,
//         c5.name  AS down5_name
//         FROM      category c0
//         LEFT JOIN category c1 ON c1.parent_id = c0.id
//         LEFT JOIN category c2 ON c2.parent_id = c1.id
//         LEFT JOIN category c3 ON c3.parent_id = c2.id
//         LEFT JOIN category c4 ON c4.parent_id = c3.id
//         LEFT JOIN category c5 ON c5.parent_id = c4.id
//         WHERE     c0.parent_id IS NULL
//         ORDER BY  c0.id, c1.id, c2.id, c3.id, c4.id, c5.id`)
//         res.status(200).json({
//             categories: rows
//         })
//         client.release()
//     }catch(e){
//         res.status(404).json({msg: 'Error 404'})
//         console.error(e.message)
//     }
// }

exports.categories = async (req, res) => {
    try{
        console.log("Podłączono do bazy z routa categories")
        const client = await pool.connect()

        const {rows} = await client.query(`SELECT *
        FROM category
        ORDER BY id ASC`)
        res.status(200).json({
            count: rows.length,
            categories: rows
        })
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.addCategory = async (req, res) => {
    try{
        const newCategory = req.body.categoryName
        if(newCategory){
            const client = await pool.connect()

            const {rows} = await client.query(`INSERT 
            INTO 
            public.category
            (name)
            VALUES ('${newCategory}');`)
    
            res.status(200).json({message: 'Pomyślnie dodano nową kategorie'})
            client.release()
        }else{
            res.status(404).json({message: 'Brak przekazanej nowej nazwy kategorii'})
        } 
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    } 
}

exports.updateCategory = async (req, res) => {
    try{
        const categoryId = req.params.id
        if(categoryId !== undefined){
            let categoryName = req.body.categoryName
            if(categoryName !== undefined){
                const client = await pool.connect()

                const {rows} = await client.query(`UPDATE 
                public.category
                SET name='${categoryName}'
                WHERE id=${categoryId}
                RETURNING id;`)
                client.release()

                const updatedId = rows[0].id
                if(updatedId > 0){
                    res.status(200).json({message: 'Zaktualizowano pomyślnie nazwe kategorii'})
                }else{
                    res.status(404).json({message: 'Nieudana zmiana nazwy kategorii'})
                }
            }else{
                res.status(404).json({message: 'Brak przekazanej nazwy kategorii'})
            }
        }else{
            res.status(404).json({message: 'Brak przekazanego ID kategorii'})
        }
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.deleteCategory = async (req, res) => {
    try{
        const categoryId = req.params.id
        if(categoryId !== undefined){
            const client = await pool.connect()

            const {rows} = await client.query(`DELETE 
            FROM 
            public.category
            WHERE id=${categoryId}
            RETURNING id;`)
            let deletedCategory = rows[0].id
            if(deletedCategory > 0){
                res.status(200).json({message: 'Pomyślnie usunięto kategorie'})
            }else{
                res.status(404).json({message: 'Nie udauło się usunąć kategorii'})
            }                
            client.release()
        }else{
            res.status(404).json({message: 'Brak przekazanego ID kategorii'})
        }

    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}


exports.category = async (req, res) => {
    try{
        console.log('Podłączono do bazy z routa category')

        let page = (req.query.page != undefined && req.query.page > 0) ? parseInt(req.query.page) : 1
        const limit = (req.query.limit != undefined && req.query.limit > 0) ? parseInt(req.query.limit) : 12
        const offset = (page - 1) * limit
        let categoryName = req.params.category

        const countQuery = await client.query(`SELECT COUNT(*) as count 
        FROM product
        JOIN category
        ON product.category_id = category.id
        WHERE category.name ILIKE $1`, ['%' + categoryName + '%'])
        const numOfProducts = countQuery.rows[0].count
        const numOfPages = Math.ceil(numOfProducts / limit)

        const {rows} = await client.query(`SELECT
        product.id,
        product.name,
        product.img,
        product.images,
        product.price,
        product.quantity,
        product.shortdesc,
        product.description,
        product.size,
        category.name as category,
        brand.name as brand
        FROM PRODUCT
        JOIN BRAND ON product.brand_id = brand.id
        JOIN CATEGORY ON product.category_id = category.id
        WHERE category.name ILIKE $1
        ORDER BY product.name ASC
        LIMIT $2
        OFFSET $3`, ['%' + categoryName + '%', limit, offset])
        if(rows != null){
            res.status(200).json({
                limit: limit,
                count: rows.length,
                totalProducts: numOfProducts,
                currentPage: page,
                totalPages: numOfPages,
                products: rows
            })
        }else{
            res.status(404).json({message: 'Brak produktów w danej kategorii'})
        }
        client.release()
    }catch(e){
        res.status(404).json({message: 'Error 404'})
        console.error(e.message)
    }
}

exports.allProducts = async (req, res) => {
    try{
        const client = await pool.connect()
        const {rows} = await client.query(`SELECT
        product.id,
        product.name,
        product.img,
        product.price,
        product.quantity,
        product.size,
        category.name as category,
        brand.name as brand
        FROM PRODUCT
        JOIN BRAND ON product.brand_id = brand.id
        JOIN CATEGORY ON product.category_id = category.id
        ORDER BY id ASC`)

        res.status(200).json({
            count: rows.length,
            products: rows
        })

        client.release()

    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.error(err.message)
    }
}

exports.deleteProduct = async (req, res) => {
    try{
        const prodId = req.params.id
        if(prodId > 0){
            const client = await pool.connect()

            const {rows} = await client.query(`DELETE
            FROM
            public."product"
            WHERE id=${prodId}
            RETURNING id`)
            let deleteProdId = rows[0].id
            if(deleteProdId > 0){
                res.status(200).json({message: 'Pomyślnie usunięto produkt'})
            }else{
                res.status(404).json({message: 'Nieudana próba usunięcia produktu'})
            }
            client.release() 
        }else{
            res.status(404).json({message: 'Bład ID produktu'})
        }
    }catch(err){
        res.status(404).json({message: 'Error 404'})
        console.error(err.message)
    }
}
