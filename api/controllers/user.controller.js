import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';


export const updateUser = async (req, res, next) =>
{
    const { street, city, state, country } = req.body.contactInfo.address
    const phoneNumber = req.body.contactInfo.phoneNumber

    const updatedContactInfo = {
        phoneNumber: phoneNumber,
        address: {
            street: street,
            city: city,
            state: state,
            country: country,
        },
    };

    // req.user is created from utils verifyToken
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
                contactInfo: updatedContactInfo,
                description: req.body.description,
            }
        }, { new: true });

        const { password, ...rest } = updateUser._doc;
        return res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req, res, next) =>
{
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));
    try {
        // Remove user and its related data from database
        await User.findByIdAndDelete(req.params.id);
        await Listing.deleteMany({ userRef: req.params.id });
        res.clearCookie('access_token');
        return res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error)
    }
}


export const getUserListings = async (req, res, next) =>
{
    try {
        const listings = await Listing.find({ userRef: req.params.id });

        return res.status(200).json(listings);
    } catch (error) {
        next(error)
    }
}


export const getUser = async (req, res, next) =>
{
    try {
        const user = await User.findById(req.params.id);

        if (!user) return next(errorHandler(404, 'User not found!'));

        const { password: pass, ...rest } = user._doc;
        return res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const updateLikes = async (req, res, next) =>
{
    if (req.user.id === req.params.id) return next(errorHandler(401, 'You cannot like your own profile'));

    try {
        const userId = req.user.id
        const userLike = await User.findOne({ likes: userId })

        if (userLike) {
            userLike.likes.pull(userId)
            userLike.save()
            return res.status(200).json('Unlike profile!')
        } else {
            await User.findByIdAndUpdate(req.params.id, {
                $push: { likes: userId }
            });

            return res.status(200).json('Like profile!')
        }
    } catch (error) {
        next(error)
    }
}