import { createConnection } from "mongoose";
import { DB_NAME } from "../constants.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from   "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "Hello, Backend"
    // })

    // STEPS FOR REGISTER USER
    // 1. GET USER DETAILS FROM FRONTEND
    // 2. VALIDATION - NOT EMPTY
    // 3. CHECK IF USER ALREADY EXIST: USERNAME OR EMAIL
    // 4. CHECK FOR IMAGES,  AVATAR
    // 5. UPLOAD THEM ON CLOUDNARY
    // 6. CREATE USER OBJECT - CREATE ENTRY IN DB
    // 7. REMOVE PASSWORD AND REFRESH TOKEN FIELD FROM RESPONSE 
    // 8. CHECK FOR USER CREATION 
    // 9 .RETURN RES 

    const {fullName, email, username, password } = req.body
    // console.log("email", email);
    // console.log("fullName", fullName);
    // console.log("username", username);
    // console.log("password", password);

    if(
        [fullName, email, username, password].some((field) =>field?.trim()==="") 
    ){
        throw new ApiError(400, "All fields are required")
    }
/// checking already exits users.........
    // User.findOne({email});
    User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
         throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required") 
    }

    const user =  await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password, 
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})



export {
    registerUser,

}