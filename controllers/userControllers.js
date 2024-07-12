import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		const token = generateToken(user._id);
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			address: user.address,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password, address } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		username,
		email,
		password,
		address,
		isAdmin: false,
	});

	if (user) {
		const token = generateToken(user._id);
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			address: user.address,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

const logoutUser = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ message: "User Logged out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
	const user = {
		_id: req.user._id,
		username: req.user.username,
		email: req.user.email,
		address: req.user.address,
		isAdmin: req.user.isAdmin,
	};
	res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.username = req.body.username || user.username;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.status(200).json({
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

//@desc    Register a new admin
//route    POST /api/users/admin
//@access  Private/Admin
const registerAdmin = asyncHandler(async (req, res) => {
	const { username, email, password, address } = req.body;

	// checking if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		username,
		email,
		password,
		address,
		isAdmin: true, // Set isAdmin to true for admins
	});

	if (user) {
		const token = generateToken(user._id);
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			address: user.address,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	registerAdmin,
};
