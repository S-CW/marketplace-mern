import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from './route/user.route.js';
import authRouter from './route/auth.route.js';
import reportRouter from './route/report.route.js';
import listingRouter from './route/listing.route.js';
import cookieParser from "cookie-parser";
dotenv.config();

mongoose.connect(process.env.MONGO_DATABASE).then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.log(err)
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/report', reportRouter);
app.use('/api/listing', listingRouter);


// Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    });
})


app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});