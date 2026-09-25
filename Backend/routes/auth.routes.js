import { Router } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/auth.middleware.js';
import JWT_SECRET from '../utils/config.js';
const router = Router();
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name email year skills');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ id: user._id, name: user.name, email: user.email, year: user.year ?? '', skills: user.skills ?? [] });
    } catch {
        res.status(500).json({ message: 'Unable to load profile' });
    }
});

router.put('/me', verifyToken, async (req, res) => {
    try {
        const { name, email, year, skills } = req.body;
        if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: req.userId } });
        if (duplicate) return res.status(409).json({ message: 'That email is already in use' });
        const normalizedSkills = Array.isArray(skills) ? skills.filter(skill => typeof skill === 'string').map(skill => skill.trim()).filter(Boolean) : [];
        const parsedYear = year === '' || year == null ? undefined : Number(year);
        if (parsedYear !== undefined && (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2200)) {
            return res.status(400).json({ message: 'Enter a valid year' });
        }
        const user = await User.findByIdAndUpdate(req.userId, {
            name: name.trim(), email: normalizedEmail, year: parsedYear, skills: normalizedSkills,
        }, { new: true, runValidators: true }).select('name email year skills');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ id: user._id, name: user.name, email: user.email, year: user.year ?? '', skills: user.skills ?? [] });
    } catch {
        res.status(500).json({ message: 'Unable to save profile' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, year, skills } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email, and password are required" });
            return;
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            year,
            skills
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    }
    catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/logout', (req, res) => {
    // If you switch to cookies later, you'll add: res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
});
export default router;
//# sourceMappingURL=auth.routes.js.map
