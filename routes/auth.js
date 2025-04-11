const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, height, weight, age, gender, goal } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            height,
            weight,
            age,
            gender,
            goal
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                height: user.height,
                weight: user.weight,
                age: user.age,
                gender: user.gender,
                goal: user.goal
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                height: user.height,
                weight: user.weight,
                age: user.age,
                gender: user.gender,
                goal: user.goal
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Funções auxiliares para cálculos nutricionais
function calculateBMR(userData) {
    const { gender, weight, height, birthDate } = userData;
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
}

function calculateTDEE(bmr, activityLevel) {
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };
    
    return bmr * activityMultipliers[activityLevel];
}

function calculateNutritionalGoals(tdee, goal) {
    let calorieAdjustment = 0;
    
    switch (goal) {
        case 'lose_weight':
            calorieAdjustment = -500; // Déficit de 500 calorias
            break;
        case 'gain_weight':
            calorieAdjustment = 500; // Superávit de 500 calorias
            break;
        default:
            calorieAdjustment = 0;
    }
    
    const calories = tdee + calorieAdjustment;
    const protein = (calories * 0.3) / 4; // 30% de proteínas
    const fat = (calories * 0.3) / 9; // 30% de gorduras
    const carbs = (calories * 0.4) / 4; // 40% de carboidratos
    
    return {
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
    };
}

module.exports = router; 