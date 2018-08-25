const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const authorization = req.headers.authorization.split(" ");
            if (authorization.length > 0) {
                const token = authorization[1];
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                req.userData = decoded;
                next();
            } else {
                return res.status(401).json({
                    message: 'Auth failed, please check the authorization token.'
                });
            }
        } else {
            return res.status(401).json({
                message: 'Auth failed, authorization token not present.'
            });
        }

    } catch (e) {
        return res.status(401).json({
            message: 'Auth failed, ' + e.message
        });
    }
}

