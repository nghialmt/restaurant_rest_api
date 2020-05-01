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

module.exports = router

