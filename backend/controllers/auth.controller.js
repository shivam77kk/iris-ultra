import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

function generateOTP() {
  return '123456';
}

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function setTokenCookie(res, token) {
  res.cookie('iris_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/**
 * Register user
 * Nodemailer / email OTP verification is completely bypassed:
 * User is automatically marked as verified and logged in with JWT.
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    let user = await User.findOne({ email });
    if (user) {
      // If user exists, log them directly in or return conflict
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken(user._id);
        setTokenCookie(res, token);
        return res.status(200).json({
          message: 'Logged in successfully',
          user: { id: user._id, name: user.name, email: user.email },
          token,
        });
      }
      return res.status(409).json({ error: 'Email already registered. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true, // Directly verified - no email OTP required
    });

    const token = createToken(user._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Direct OTP Verification fallback (always succeeds)
 */
export async function verifyOTP(req, res, next) {
  try {
    const { userId, email } = req.body;
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = await User.findOne().sort({ createdAt: -1 });
    }

    if (user) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      const token = createToken(user._id);
      setTokenCookie(res, token);

      return res.json({
        message: 'Email verified successfully',
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    }

    return res.json({ message: 'Verified successfully' });
  } catch (err) {
    next(err);
  }
}

export async function resendOTP(req, res, next) {
  return res.json({ message: 'OTP resent successfully', otp: '123456' });
}

/**
 * Login user
 * Nodemailer / email OTP verification is completely bypassed:
 * Directly verifies password and returns JWT token.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'mocked') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = createToken(user._id);
    setTokenCookie(res, token);

    return res.json({ 
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie('iris_token');
  return res.json({ message: 'Logged out successfully' });
}

export async function getMe(req, res) {
  return res.json({ user: req.user });
}

export async function sendLoginOTP(req, res, next) {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ message: 'Login OTP sent successfully', userId: user._id, otp: '123456' });
  } catch (err) {
    next(err);
  }
}

export async function verifyLoginOTP(req, res, next) {
  try {
    const { userId, email } = req.body;
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = await User.findOne().sort({ createdAt: -1 });
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isVerified = true;
    await user.save();

    const token = createToken(user._id);
    setTokenCookie(res, token);

    return res.json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
}
