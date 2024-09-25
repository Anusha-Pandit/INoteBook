var jwt = require('jsonwebtoken');
const jwt_secret = 'IAnusha';

const fetchUser = (req, res, next) => {
    //get user from jwt token and add id to req obj
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, jwt_secret);
        req.user = { id: data.id };
        console.log(data); 
        next();
    } catch (error) {
        res.status(401).send({ error: "Authenticate using a valid token" })

    }
}

module.exports = fetchUser;