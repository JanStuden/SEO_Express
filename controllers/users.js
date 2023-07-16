import User from "../models/user.js";
import {comparePassword, generateHash, generateJWT} from "../services/authentication.js";
import Dashboard from "../models/dashboard.js";
import {sendDeletionConfirmation, sendRecoveryMail, sendSignUpMail} from "../services/mailing.js";


export const signUp = async (req, res) => {
    const body = req.body;
    const username = body.username;
    const newPWD = Math.random().toString(36).slice(-8);
    //const password = body.password;
    const email = body.email;
    const mailCheck = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const messeCheck = /^[a-zA-Z0-9_.+-]+@[Mm]esse-[Mm]uenchen\.de$/;
    let altId = ""

    try {
        const altUser = await User.findOne({ email: email });
        altId = altUser._id.toString()
    } catch (error) {
        altId = ""
    }

    if (email !== '' && email.match(mailCheck) && /*email.match(messeCheck) &&*/ altId == "") {
        const hash = await generateHash(newPWD);
        const newUser = new User({ username, password: hash, email, dashboards: []});

        try {
            await newUser.save();
            const token = generateJWT(newUser);
            await sendSignUpMail(email, username, newPWD)
            //res.status(201).json({ token });
            res.status(201).json({ message: "We sent you a confirmation mail with a temporary password. Please login and change the password as soon as possible." });
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    } else if (altId != "") {
        res.status(400).json({ message: "The email is already connected to an account." });
    } else if (email !== '' && email.match(mailCheck) && !email.match(messeCheck) && altId == "") {
        res.status(400).json({ message: "You are not part of the Messe Muenchen organization." });
    } else {
        res.status(400).json({ message: "The provided email is not in a valid format." });
    }
}

export const updateUser = async (req, res) => {
    //Get the different body contents
    const body = req.body;
    const username = body.username;
    const newPassword = body.password;
    const confirmPassword = body.confirmPassword;
    const oldPassword = body.oldPassword;
    const email = body.email;
    const newUser = {}

    let hash = "";
    let errorExists = false;
    let errorMessage = "";
    let altId = "";

    //Define RegEx pattern for the mail validation
    const mailCheck = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    const messeCheck = /^[a-zA-Z0-9_.+-]+@[Mm]esse-[Mm]uenchen\.de$/

    //Get the user data from mongoDB by name
    const user = await User.findOne({ username: username });

    if (!user || user == null) {
        res.status(404).json({message: "Your user account doesn't exist. Please sign up or login first."});
    } else if (confirmPassword !== newPassword && confirmPassword && newPassword !== user.password) {
        res.status(404).json({message: "Your confirmed password does not match your new password."});
    }

    //Try to get a user by mail
    try {
        const altUser = await User.findOne({ email: email });
        altId = altUser._id.toString()
    } catch (error) {
        altId = ""
    }

    //Check if the email matches the regex expression
    if (!email.match(mailCheck) && email) {
        //If the mail doesn't match, create an error message and set flag
        errorExists = true;
        errorMessage = errorMessage + "The email address does not match a valid format. " + email
        console.log("After Mail Pattern Before Duplicate Mail Check")
    //Check whether there is already another user with the same mail
    } else if (altId.toString() !== user._id.toString() && altId !== "" && email) {
        errorExists = true;
        errorMessage = errorMessage + "The email address is already connected to a different account."
    } else if (!email.match(messeCheck) && email) {
        errorExists = true;
        errorMessage = errorMessage + "You are not part of the Messe Muenchen organization."
    } else if (!email || email == null) {
        newUser.email = user.email
    }

    //Check whether the password has been changed
    if (user.password !== newPassword && newPassword !== null && newPassword) {
        //If the password has been changed, create a new hash
        hash = await generateHash(newPassword);
        newUser.password = hash;
    //Set the existing password for the new user
    }

    //Check if the validation password is correct
    if (!await comparePassword(oldPassword, user.password)) {
        errorExists = true;
        errorMessage = errorMessage + "The current password is incorrect."
    }

    if (errorExists == false && await comparePassword(oldPassword, user.password)) {

        try {
            const updatedUser = await User.findByIdAndUpdate(user.id, newUser);
            const token = generateJWT(newUser);
            res.status(201).json({ token });
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    } else {
        res.status(403).json({message: errorMessage})
    }
}

export const login = async (req, res) => {
    const body = req.body;
    const username = body.username;
    const password = body.password;

    try {
        const user = await User.findOne({ username });
        if (user && await comparePassword(password, user.password)) {
            const token = generateJWT(user);
            res.status(200).json({ token });
        } else {
            throw new Error("Either username or password are incorrect.");
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {

    const localUser = req.params.localUser;

    try {
        const user = await User.find({username: localUser});
        if (user && user !== null) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Please login first." });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const resetPassword = async (req, res) => {

    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (user) {
        try {
            const newPWD = Math.random().toString(36).slice(-8);
            const hash = await generateHash(newPWD);

            user.password = hash;

            const updatedUser = await User.findByIdAndUpdate(user.id, user);

            await sendRecoveryMail(email, user.username, newPWD)

            res.status(200).json({message: "Your new password has been sent. Please check your inbox."});
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: "There is no user with this email." });
    }
}

export const deleteUser = async (req, res) => {
    const username = req.body.username;
    let password = ""

    try {
        password = req.body.oldPassword
    } catch {
        password = ""
    }

    console.log(password)

    try {
        const user = await User.findOne({ username });
        if (password == "") {
            res.status(403).json({ message: "Please enter your password." });
        } else if (user && await comparePassword(password, user.password)) {
            const userId = user._id
            const email = user.email
            await sendDeletionConfirmation(email, username)
            await User.findByIdAndDelete(userId)
            res.status(202).json()
        } else {
            res.status(401).json({ message: "The password your entered is wrong." });
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}