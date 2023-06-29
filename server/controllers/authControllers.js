const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errors, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
    try {
        console.log("this is from signup ");
        // res.send("hello user");
        const { email, password , name } = req.body;

        if (!email || !password || !name) {
            // return res.status(404).send("Email and password is required");
            return res.send(errors(400, "all fields are required"));
        }

        const check = await User.findOne({ email });

        if (check) {
            // return res.status(409).send("User already exist");
            return res.send(errors(403, "User already Exits"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.send(success(201, "user created Successfully"));
    } catch (e) {
       return res.send(errors(500 , e.message))
    }
};

const loginController = async (req, res) => {
    try {
        // res.send("this is from login");

        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(404).send("Email and password is required");
            return res.send(errors(404, "All fields are required"));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // return res.status(404).send("User is not registered");
            return res.send(errors(404, "User is not registered"));
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            // return res.status(403).send("Incorrect password");
            return res.send(errors(403, "Incorrect Password"));
        }

        const accessToken = generateAcessToken({
            _id: user._id,
        });

        const refreshToken = generateRefreshToken({
            _id: user._id,
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            // secure: true,
        });

        // return res.json({ accessToken });
        return res.send(success(200, { accessToken }));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const refreshAcceessTokenController = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies.jwt) {
            // return res.status(401).send("refresh token is Required");
            return res.send(errors(401, "refresh token is Required"));
        }

        const refreshToken = cookies.jwt;

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;

        const accessToken = generateAcessToken({ _id });

        // return res.status(201).json({
        //     accessToken,
        // });

        return res.send(success(200, { accessToken }));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const generateAcessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1d",
        });
        console.log(token);
        return token;
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const generateRefreshToken = (data) => {
    try {
        const refreshToken = jwt.sign(
            data,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {
                expiresIn: "2d",
            }
        );
        return refreshToken;
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const logoutController = async (req ,res)=>{

    try {
        res.clearCookie('jwt' , {
            httpOnly:true,
            secure:true,
        })
        return res.send(success(200 , "user logged out"))
    } catch (e) {
        return res.send(errors(500 , e.message));
    }
}

module.exports = {
    loginController,
    signupController,
    refreshAcceessTokenController,
    logoutController,
};
