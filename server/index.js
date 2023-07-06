const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const authRouter = require("./routers/authRouters");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouters");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const app = express();
dotenv.config("./.env");

app.use(express.json({ limit: "1000mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);
const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    res.status(200).send("Ok from server");
});

app.use(
    fileUpload({
        useTempFiles: true,
        // limits: { fileSize: 50 * 2024 * 1024 },
    })
);

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

dbConnect();

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
