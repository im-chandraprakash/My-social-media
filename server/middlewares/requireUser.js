const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errors } = require("../utils/responseWrapper");

module.exports = async (req, res, next) => {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
    ) {
        // return res.status(401).send("Autherization token is required");
        return res.send(errors(401, "Authorization token is required"));
    }

    const accessToken = req.headers.authorization.split(" ")[1];
    // console.log(accessToken);
    console.log(" middleware is calling");

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY
        );

        console.log("decoded value : ", decoded);
        console.log("decoded id : ", decoded._id);

        req._id = decoded._id;
        const user = await User.findById(req._id);
        if(!user){
            console.log(errors(404 , "user not found"));
        }
        console.log("complete");
        next();
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Autherization token is required");
        return res.send(errors(401, "Authorization token is required"));
    }

    // next();
};
