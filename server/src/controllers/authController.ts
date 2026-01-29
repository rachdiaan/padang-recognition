import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { generateToken } from '../utils/generateToken';

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await Admin.findOne({ username });

    if (user && (await (user as any).matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// @desc    Register a new admin (Development only)
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const userExists = await Admin.findOne({ username });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await Admin.create({
        username,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export { authUser, registerAdmin };
