const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const mongoUri =
            "mongodb+srv://chandra01:8h1RlIUK0jQZPFjt@cluster0.znbs66c.mongodb.net/?retryWrites=true&w=majority";

        // const mongoUri =
        //     "mongodb+srv://fakehai731:QDBJZ9101XB0r4Uk@cluster0.r2waexb.mongodb.net/?retryWrites=true&w=majority";

        const connect = await mongoose.connect(
            mongoUri,
            { useNewUrlParser: true, useUnifiedTopology: true },
            () => {
                console.log("MongoDB is connected");
            }
        );

        // console.log(`Connection host is : ${connect.connection.host}`);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
