const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret')
        req.userData = decoded;
        console.log(userData);
        next();    
    } catch (error) {
        return res.status(401).json({ // unauthorized
            message: "Auth Faild 5",
            error
        });
    }
    
}