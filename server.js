const express = require("express");
const morgan = require("morgan");
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require('helmet');

require("dotenv").config();
require("./config/db")();

const app = express();

const port = process.env.PORT || 5001;

//Middlewares
app.use(helmet());  // Enhance security by setting secure HTTP headers
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// app.use(morgan("dev"));
app.use(morgan('[:date[clf]] :remote-addr  HTTP/:http-version  :method  :url  (:response-time ms)  :res[content-length]  :status'));

app.get('/in', (req, res) => {
    res.send("Hello");
})

// Define routes
const authRoute = require("./constants/routes").AUTH;
const authRouter = require("./routes/authRoutes");

const userRoute = require("./constants/routes").USER;
const userRouter = require("./routes/userRoutes");

const productRoute = require("./constants/routes").PRODUCT;
const productRouter = require("./routes/productRoutes");

const orderRoute = require("./constants/routes").ORDERS
const orderRouter = require("./routes/orderRoutes");

// Use routes
app.use(authRoute, authRouter);
app.use(userRoute, userRouter);
app.use(productRoute, productRouter);
app.use(orderRoute, orderRouter);


// For Invalid Routes
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Invalid Route"
    })
});

// app.use(errorHandler);  

app.listen(port, () => {
    console.log("===================**===================");
    console.log(`Listening on http://localhost:${port}`);
});
