/**
 * Authentication Routes for Autodin
 * Passwordless authentication with email verification codes
 */

import { Router, Request, Response } from 'express'
import { MongoClient, Db } from 'mongodb'
import { Logger } from '../utils/Logger'
import * as nodemailer from 'nodemailer'
import { randomInt } from 'crypto'

const router = Router()
const logger = Logger.getInstance()

// MongoDB connection
let db: Db | null = null

const getDb = async (): Promise<Db> => {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017')
    await client.connect()
    db = client.db('autodin')
    logger.info('Connected to Autodin database')
  }
  return db
}

// Email transporter setup
const createTransporter = () => {
  const config: any = {
    host: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'AKIASIUVSCNOIYDDKYUC',
      pass: process.env.SMTP_PASS || 'BI222lL2lNMOLeHvX7+sHZoAyrkPWXozXsiIkwplaXNX'
    }
  }

  // For port 465, use secure connection
  if (config.port === 465) {
    config.secure = true
  }

  return nodemailer.createTransport(config)
}

// Generate 6-digit code
const generateCode = (): string => {
  return String(randomInt(100000, 999999))
}

// Send authentication code email
const sendAuthCodeEmail = async (email: string, code: string, workspace: string = 'autodin') => {
  try {
    const transporter = createTransporter()
    
    const workspaceName = workspace === 'autodin' ? 'Autodin' : 'QWANYX'
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Phil QWANYX <phil@qwanyx.com>',
      to: email,
      subject: `${workspaceName} - Code de connexion`,
      html: `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Votre code de connexion ${workspaceName}</h2>
          <p>Utilisez ce code pour vous connecter :</p>
          <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
            ${code}
          </h1>
          <p>Ce code expire dans 10 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </body>
        </html>
      `
    }
    
    await transporter.sendMail(mailOptions)
    logger.info(`Email sent to ${email} with code`)
    
  } catch (error) {
    logger.error('Failed to send email:', error)
    // Still log the code for development
    logger.info(`AUTH CODE for ${email}: ${code}`)
    throw error
  }
}

// Register endpoint
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, phone, accountType, companyName, vatNumber, proTypes } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const database = await getDb()
    const users = database.collection('users')
    
    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }
    
    // Create user
    const user = {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      accountType: accountType || 'particulier',
      companyName: companyName || '',
      vatNumber: vatNumber || '',
      proTypes: proTypes || [],
      workspace: 'autodin',
      createdAt: new Date(),
      lastLogin: null,
      isVerified: false,
      authMethod: 'code'
    }
    
    const result = await users.insertOne(user)
    
    // Generate and send auth code
    const code = generateCode()
    const authCodes = database.collection('auth_codes')
    
    await authCodes.insertOne({
      email,
      code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      used: false
    })
    
    // Try to send email
    try {
      await sendAuthCodeEmail(email, code)
    } catch (emailError) {
      // Email failed but still continue
      logger.error('Email sending failed but continuing:', emailError)
    }
    
    // Always log code for development
    logger.info(`AUTH CODE for ${email}: ${code}`)
    
    res.json({
      success: true,
      message: 'Registration successful. Check your email for verification code.',
      requiresCode: true
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Request code endpoint (for existing users)
router.post('/auth/request-code', async (req: Request, res: Response) => {
  try {
    const { email, workspace } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    
    const database = await getDb()
    const users = database.collection('users')
    
    // Check if user exists
    const user = await users.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Aucun compte trouvé avec cet email. Veuillez vous inscrire.' 
      })
    }
    
    // Generate new code
    const code = generateCode()
    const authCodes = database.collection('auth_codes')
    
    // Invalidate old codes for this email
    await authCodes.updateMany(
      { email, used: false },
      { $set: { used: true } }
    )
    
    // Insert new code
    await authCodes.insertOne({
      email,
      code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      used: false
    })
    
    // Try to send email
    try {
      await sendAuthCodeEmail(email, code, workspace || 'autodin')
    } catch (emailError) {
      logger.error('Email sending failed but continuing:', emailError)
    }
    
    // Always log code for development
    logger.info(`AUTH CODE for ${email}: ${code}`)
    
    res.json({
      success: true,
      message: 'Code sent',
      requiresCode: true
    })
  } catch (error) {
    logger.error('Request code error:', error)
    res.status(500).json({ error: 'Failed to send code' })
  }
})

// Old login endpoint - now just requests a code
router.post('/auth/login', async (req: Request, res: Response) => {
  // Redirect to request-code for backward compatibility
  return router.handle(Object.assign(req, { url: '/auth/request-code' }), res, () => {})
})

// Verify code endpoint
router.post('/auth/verify-code', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' })
    }
    
    const database = await getDb()
    const authCodes = database.collection('auth_codes')
    
    // Find valid code
    const authCode = await authCodes.findOne({
      email,
      code,
      used: false,
      expiresAt: { $gt: new Date() }
    })
    
    if (!authCode) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    
    // Mark code as used
    await authCodes.updateOne(
      { _id: authCode._id },
      { $set: { used: true, usedAt: new Date() } }
    )
    
    // Get user
    const users = database.collection('users')
    const user = await users.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Update last login
    await users.updateOne(
      { email },
      { 
        $set: { 
          lastLogin: new Date(),
          isVerified: true 
        } 
      }
    )
    
    // Generate token (simple base64 for now, should use JWT in production)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    
    logger.info(`User logged in with code: ${email}`)
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workspace: user.workspace || 'autodin'
      },
      token
    })
  } catch (error) {
    logger.error('Verify code error:', error)
    res.status(500).json({ error: 'Verification failed' })
  }
})

// Verify token endpoint
router.get('/auth/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    // Decode token (simple base64 for now)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [email] = decoded.split(':')
    
    const database = await getDb()
    const users = database.collection('users')
    
    const user = await users.findOne({ email })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workspace: user.workspace || 'autodin'
      }
    })
  } catch (error) {
    logger.error('Verify error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Get all users (for dashboard)
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const database = await getDb()
    const users = database.collection('users')
    
    const allUsers = await users.find({}).toArray()
    
    res.json(allUsers.map(user => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
      createdAt: user.createdAt
    })))
  } catch (error) {
    logger.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to get users' })
  }
})

export default router