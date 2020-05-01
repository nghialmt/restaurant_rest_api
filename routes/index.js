const API_KEY = 1234

const express = require('express');
const router = express.Router();
const moment = require('moment')

//GET
router.get('/', function (req, res, next) {
    res.send('Check connection')
})


//=======================================================================================
// USER TABLE
// GET / POST
//=======================================================================================
router.get('/user', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const fbid = req.query.fbid;

        if (fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('SELECT userPhone,name,address,fbid FROM User WHERE fbid=?', [fbid], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        else
            res.send(JSON.stringify({success: false, message: "Missing fbid in body"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.post('/user', function (req, res, next) {
    if (req.body.key == API_KEY) {
        const fbid = req.body.fbid;
        const user_phone = req.body.userPhone;
        const user_name = req.body.userName;
        const user_address = req.body.userAddress;


        if (fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('INSERT INTO User(FBID,UserPhone,Name,Address) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE Name=?,Address=?',
                    [fbid, user_phone, user_name, user_address, user_name, user_address],
                    function (err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({success: false, message: err.message}))
                        } else {
                            if (rows.affectedRows > 0)
                                res.send(JSON.stringify({success: true, message: "Success"}))
                        }
                    })
            })
        else
            res.send(JSON.stringify({success: false, message: "Missing fbid in body"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// FAVORIST TABLE
// GET / POST /DELETE
//=======================================================================================
router.get('/favorite', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const fbid = req.query.fbid;

        if (fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('SELECT fbid,foodId,restaurantId,restaurantName,foodName,foodImage,price  FROM Favorite WHERE fbid=?', [fbid], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.get('/favoriteByRestaurant', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const fbid = req.query.fbid;
        const restaurant_id = req.query.restaurantId;

        if (fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('SELECT fbid,foodId,restaurantId,restaurantName,foodName,foodImage,price  FROM Favorite WHERE fbid=? AND restaurantId', [fbid, restaurant_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.post('/favorite', function (req, res, next) {
    if (req.body.key == API_KEY) {
        const fbid = req.body.fbid;
        const food_id = req.body.foodId;
        const restaurant_id = req.body.restaurantId;
        const restaurant_name = req.body.restaurantName;
        const food_name = req.body.foodName;
        const food_image = req.body.foodImage;
        const food_price = req.body.price;


        if (fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('INSERT INTO Favorite(FBID,FoodId,RestaurantId,RestaurantName,FoodName,FoodImage,Price) VALUES(?,?,?,?,?,?,?)',
                    [fbid, food_id, restaurant_id, restaurant_name, food_name, food_image, food_price], function (err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({success: false, message: err.message}))
                        } else {
                            if (rows.affectedRows > 0)
                                res.send(JSON.stringify({success: true, message: "Success"}))
                        }
                    })
            })
        else
            res.send(JSON.stringify({success: false, message: "Missing fbid in body"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.delete('/favorite', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const fbid = req.query.fbid;
        const food_id = req.query.foodId;
        const restaurant_id = req.query.restaurantId;

        if (fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('DELETE FROM Favorite WHERE FBID=? AND FoodId=? AND RestaurantId=?', [fbid, food_id, restaurant_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.affectedRows > 0)
                            res.send(JSON.stringify({success: true, message: 'Success'}))

                    }
                })
            })
        else
            res.send(JSON.stringify({success: false, message: "Missing fbid in body"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))

})

//=======================================================================================
// RESTAURANT TABLE
// GET
//=======================================================================================
router.get('/restaurant', function (req, res, next) {
    if (req.query.key == API_KEY) {
        req.getConnection(function (error, conn) {
            conn.query('SELECT id,Name,Address,Phone,Lat,Lng,UserOwner,Image,PaymentUrl FROM Restaurant', function (err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0)
                        res.send(JSON.stringify({success: true, results: rows}))
                    else
                        res.send(JSON.stringify({success: false, message: "Empty"}))

                }
            })
        })
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.get('/restaurantById', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const restaurant_id = req.query.restaurantId;

        if (restaurant_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT id,Name,Address,Phone,Lat,Lng,UserOwner,Image,PaymentUrl FROM Restaurant WHERE id=?', [restaurant_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing restaurantId in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.get('/nearByRestaurant', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const user_lat = parseFloat(req.query.lat);
        const user_lng = parseFloat(req.query.lng);
        const distance = parseFloat(req.query.distance);

        if (user_lat != Number.NaN && user_lng != Number.NaN) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT * FROM (SELECT id,name,address,phone,lat,lng,userOwner,image,paymentUrl,'
                    + 'ROUND(111.045 * DEGREES(ACOS(COS(RADIANS(?)) * COS(RADIANS(lat))'
                    + '* COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?))'
                    + '* SIN(RADIANS(lat)))),2) AS distance_in_km FROM Restaurant)tempTable WHERE distance_in_km < ?', [user_lat, user_lng, user_lat, distance], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing lat and lng of user"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// MENU TABLE
// GET
//=======================================================================================
router.get('/menu', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const restaurant_id = req.query.restaurantId;

        if (restaurant_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT id,Name,Description,Image FROM Menu WHERE id IN  (SELECT menuId FROM Restaurant_Menu WHERE restaurantId=?)', [restaurant_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing restaurantId in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// MENU TABLE
// GET
//=======================================================================================
router.get('/food', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const menu_id = req.query.menuId;

        if (menu_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT Id,Name,Description,Image,Price,CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,'
                    + 'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'FALSE\' END as isAddon,'
                    + 'discount FROM Food WHERE id IN  (SELECT foodId FROM Menu_Food WHERE menuId=?)', [menu_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing menuId in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.get('/foodById', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const food_id = req.query.foodId;

        if (food_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT Id,Name,Description,Image,Price,CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,'
                    + 'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'FALSE\' END as isAddon,'
                    + 'discount FROM Food WHERE id =?', [food_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing foodId in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.get('/searchFood', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const search_query = '%' + req.query.foodName + '%';

        if (search_query != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT Id,Name,Description,Image,Price,CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,'
                    + 'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'FALSE\' END as isAddon,'
                    + 'discount FROM Food WHERE name LIKE ?', [search_query], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing Food Name in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// SIZE TABLE
// GET
//=======================================================================================
router.get('/size', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const food_id = req.query.foodId;

        if (food_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT id,description,extraPrice FROM Size WHERE id in (SELECT sizeId FROM Food_Size WHERE foodId=?)', [food_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing foodId in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// SIZE TABLE
// GET
//=======================================================================================
router.get('/addon', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const food_id = req.query.foodId;

        if (food_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT id,description,extraPrice FROM Addon WHERE id in (SELECT addonId  FROM Food_Addon WHERE foodId=?)', [food_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing foodId in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// ORDER TABLE
// GET / POST
//=======================================================================================
router.get('/order', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const order_fbid = req.query.orderFBID;

        if (order_fbid != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT orderId,OrderFBID,OrderPhone,OrderName,OrderAddress,OrderStatus,OrderDate,RestaurantId,TransactionId,' +
                    'CASE WHEN COD=1 THEN \'TRUE\' ELSE \'FALSE\' END as COD,' +
                    'TotalPrice,NumOfItem FROM `Order` WHERE OrderFBID =? AND NumOfItem > 0' +
                    ' ORDER BY orderId DESC', [order_fbid], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing orderFBID in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.post('/createOrder', function (req, res, next) {
    if (req.body.key == API_KEY) {
        const order_phone = req.body.orderPhone;
        const order_name = req.body.orderName;
        const order_address = req.body.orderAddress;
        const order_date = moment(req.body.orderDate, "MM/DD/YYYY").format("YYYY-MM-DD");
        const restaurant_id = req.body.restaurantId;
        const transaction_id = req.body.transactionId;
        const cod = req.body.cod;
        const total_price = req.body.totalPrice;
        const num_of_item = req.body.numOfItem;
        const order_fbid = req.body.orderFBID;

        if (order_fbid != null)
            req.getConnection(function (error, conn) {
                conn.query('INSERT INTO `Order`(OrderFBID,OrderPhone,OrderName,OrderAddress,OrderStatus,OrderDate,RestaurantId,TransactionId,COD,TotalPrice,NumOfItem)' +
                    ' VALUES(?,?,?,?,?,?,?,?,?,?,?)', [order_fbid, order_phone, order_name, order_address, 0, order_date, restaurant_id, transaction_id, cod, total_price, num_of_item], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        conn.query('SELECT OrderId as orderNumber FROM `Order` WHERE OrderFBID =? AND NumOfItem > 0'
                            + ' ORDER BY orderNumber DESC LIMIT 1', [order_fbid], function (err, rows, fields) {
                            if (err) {
                                res.status(500);
                                res.send(JSON.stringify({success: false, message: err.message}))
                            } else
                                res.send(JSON.stringify({success: false, results: rows}))
                        })
                    }
                })
            })
        else
            res.send(JSON.stringify({success: false, message: "Missing order fbid in body"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

//=======================================================================================
// ORDERDETAIL TABLE
// GET / POST
//=======================================================================================
router.get('/orderDetail', function (req, res, next) {
    if (req.query.key == API_KEY) {
        const order_id = req.query.orderId;

        if (order_id != null) {
            req.getConnection(function (error, conn) {
                conn.query('SELECT OrderId,ItemId,Quantity,Price,Discount,Size,Addon,ExtraPrice FROM OrderDetail WHERE OrderId =?', [order_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        if (rows.length > 0)
                            res.send(JSON.stringify({success: true, results: rows}))
                        else
                            res.send(JSON.stringify({success: false, message: "Empty"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing order id in query"}))

    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

router.post('/updateOrder', function (req, res, next) {
    if (req.body.key == API_KEY) {
        const order_id = req.body.orderId;
        var order_detail

        try {
            order_detail = JSON.parse(req.body.orderDetail)
        } catch (err) {
            res.status(500);
            res.send(JSON.stringify({success: false, message: err.message}))
        }

        if (order_detail != null && order_id != null) {

            var dataInsert = []
            for (i = 0; i < order_detail.length; i++) {
                dataInsert[i] = [
                    parseInt(order_id),
                    order_detail[i]["foodId"],
                    order_detail[i]["foodQuantity"],
                    order_detail[i]["foodPrice"],
                    0,
                    order_detail[i]["foodSize"],
                    order_detail[i]["foodAddon"],
                    order_detail[i]["foodExtraPrice"]]
            }

            req.getConnection(function (error, conn) {
                conn.query('INSERT INTO OrderDetail(OrderId,ItemId,Quantity,Price,Discount,Size,Addon,ExtraPrice) VALUES(?)', dataInsert, function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "update success"}))

                    }
                })
            })
        } else
            res.send(JSON.stringify({success: false, message: "Missing order id and order detail in body"}))
    } else
        res.send(JSON.stringify({success: false, message: "Wrong API Key"}))
})

module.exports = router

