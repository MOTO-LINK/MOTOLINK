const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
    const { email, password, phoneNumber, role, nationalId } = req.body;
    try {
        const checkEmail = await User.findUserByEmail(email);
        if (checkEmail) {
            return res.status(400).json({ message: 'This Email is already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(email, hashedPassword, phoneNumber, role, nationalId);

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Some error happened in the server. Try again later!' });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Some error happened in the server. Try again later!' });
    }
};

module.exports = { signup, signin };