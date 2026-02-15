import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { config } from '../config/database.js';
import prisma from '../config/db.js';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

// ==================== STUDENT SIGNUP ====================
export const studentSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, parentName, parentPhone, schoolName } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstName, lastName, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create student user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'student',
        age: age ? parseInt(age) : null,
        parentName: parentName || null,
        parentPhone: parentPhone || null,
        schoolName: schoolName || null,
        status: 'active',
        isVerified: false,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        age: user.age,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== PARTNER SIGNUP ====================
export const partnerSignup = async (req, res) => {
  try {
    const {
      name,
      partnerType,
      email,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      contactPersonName,
      contactPersonDesignation,
      contactPersonPhone,
      website,
      password,
    } = req.body;

    // Validation
    if (!name || !partnerType || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, partnerType, email, phone, password',
      });
    }

    // Validate partner type
    const validPartnerTypes = ['school', 'franchise', 'institute'];
    if (!validPartnerTypes.includes(partnerType)) {
      return res.status(400).json({
        success: false,
        message: 'Partner type must be one of: school, franchise, institute',
      });
    }

    // Check if email already registered (user or partner)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingPartner = await prisma.partner.findUnique({ where: { email } });

    if (existingUser || existingPartner) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create partner entity first
    const partner = await prisma.partner.create({
      data: {
        name,
        partnerType,
        email,
        phone,
        address: {
          street: street || '',
          city: city || '',
          state: state || '',
          postalCode: postalCode || '',
          country: country || '',
        },
        contactPerson: {
          name: contactPersonName || '',
          designation: contactPersonDesignation || '',
          phone: contactPersonPhone || '',
        },
        website: website || '',
        approved: false,
      },
    });

    // Create partner user
    const partnerUser = await prisma.user.create({
      data: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || 'Partner',
        email,
        password: hashedPassword,
        role: 'partner',
        status: 'active',
        isVerified: false,
        partnerId: partner.id,
      },
    });

    // Generate token
    const token = generateToken(partnerUser.id, partnerUser.role);

    res.status(201).json({
      success: true,
      message: 'Partner account created successfully. Awaiting admin approval.',
      token,
      user: {
        id: partnerUser.id,
        firstName: partnerUser.firstName,
        lastName: partnerUser.lastName,
        email: partnerUser.email,
        role: partnerUser.role,
        partnerId: partner.id,
      },
      partner: {
        id: partner.id,
        name: partner.name,
        partnerType: partner.partnerType,
        approved: partner.approved,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { partner: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked',
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Prepare user data to send
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      age: user.age,
      isVerified: user.isVerified,
      status: user.status,
    };

    // If partner, fetch partner details
    let partnerData = null;
    if (user.role === 'partner' && user.partner) {
      partnerData = {
        id: user.partner.id,
        name: user.partner.name,
        partnerType: user.partner.partnerType,
        approved: user.partner.approved,
      };
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userData,
      ...(partnerData && { partner: partnerData }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET PROFILE ====================
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { partner: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// ==================== VERIFY EMAIL ====================
export const verifyEmail = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { isVerified: true }
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verify current password
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
