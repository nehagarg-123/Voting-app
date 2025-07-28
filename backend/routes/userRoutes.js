import express from 'express';
// Assuming a named export from your model file. If it's a default export, remove the curly braces.
import { User } from './../models/user.js';
import { jwtAuthMiddleware, generateToken } from './../jwt.js';

const router = express.Router();

// POST route for user signup
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        // Check if an admin already exists before allowing a new admin to be created
        if (data.role === 'admin') {
            const adminUser = await User.findOne({ role: 'admin' });
            if (adminUser) {
                return res.status(400).json({ error: 'Admin user already exists. Cannot register another admin.' });
            }
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this Aadhar Card Number already exists.' });
        }
        
        // *FIX: Create user object with only allowed fields to prevent mass assignment*
        const newUser = new User({
            name: data.name,
            age: data.age,
            email: data.email,
            mobile: data.mobile,
            address: data.address,
            aadharCardNumber: data.aadharCardNumber,
            password: data.password,
            role: data.role
        });

        const savedUser = await newUser.save();
        console.log('User data saved');

        const payload = { id: savedUser.id };
        const token = generateToken(payload);

        // *FIX: Do not send the entire user object back. Send only the token and a success message.*
        res.status(200).json({ message: 'Registration successful', token: token });

    } catch (err) {
        console.error(err);
        // Provide more specific validation error messages if possible
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route for user login
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;

        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Aadhar Card Number or Password' });
        }

        // *IMPROVEMENT: Add role to payload for easier access control*
        const payload = {
            id: user.id,
            role: user.role
        };
        const token = generateToken(payload);

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET route to view user profile
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        // *FIX: Use .select('-password') to exclude the password hash from the result*
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route to update user password
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new passwords are required' });
        }

        const user = await User.findById(userId);

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }
        
        // This relies on a pre-save hook in your User model to hash the new password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;