# QWANYX Security Standards - Certification Grade Code

## 🔒 Security Levels

### Level 1: Basic Security (Minimum Required)
- Input validation on all user inputs
- SQL/NoSQL injection prevention
- XSS protection
- CSRF tokens
- Secure password hashing

### Level 2: Enhanced Security (Standard)
- All Level 1 requirements
- Rate limiting
- Session management
- Audit logging
- Error handling without information leakage

### Level 3: Advanced Security (Target)
- All Level 2 requirements
- End-to-end encryption for sensitive data
- Multi-factor authentication
- Anomaly detection
- Security headers implementation

### Level 4: Certification Grade (Goal)
- All Level 3 requirements
- Compliance with ISO 27001, SOC 2, GDPR
- Penetration testing passed
- Security audit trail
- Zero-trust architecture

## 🛡️ Mandatory Security Practices

### 1. Input Validation - NEVER Trust User Input

```typescript
// ❌ NEVER - Direct use of user input
app.post('/user', (req, res) => {
  const user = req.body; // DANGEROUS
  db.users.insert(user);
});

// ✅ ALWAYS - Validate with Zod schemas
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\s-']+$/),
  age: z.number().int().min(13).max(120),
  role: z.enum(['user', 'admin', 'moderator']),
});

app.post('/user', (req, res) => {
  try {
    const validatedUser = UserSchema.parse(req.body);
    // Safe to use validatedUser
    db.users.insert(validatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

### 2. Authentication & Authorization

```typescript
// Authentication Middleware
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = await verifyJWT(token);
    req.user = decoded;
    
    // Check token expiration
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    // Check token revocation
    const isRevoked = await checkTokenRevocation(token);
    if (isRevoked) {
      return res.status(401).json({ error: 'Token revoked' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization Middleware
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const hasPermission = await checkUserPermission(req.user.id, permission);
    
    if (!hasPermission) {
      // Log unauthorized access attempt
      await logSecurityEvent({
        type: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        userId: req.user.id,
        permission,
        ip: req.ip,
        timestamp: new Date(),
      });
      
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### 3. Data Encryption

```typescript
// Encryption Service
import crypto from 'crypto';

class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  
  constructor() {
    // Key should be from secure environment variable
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }
  
  encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }
  
  decrypt(data: EncryptedData): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(data.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
    
    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage for sensitive data
const encryptionService = new EncryptionService();

// Encrypt before storing
const encryptedSSN = encryptionService.encrypt(user.ssn);
await db.users.update({ 
  id: user.id, 
  ssn_encrypted: encryptedSSN 
});

// Decrypt when needed
const user = await db.users.findById(userId);
const ssn = encryptionService.decrypt(user.ssn_encrypted);
```

### 4. SQL/NoSQL Injection Prevention

```typescript
// ❌ NEVER - String concatenation
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// ❌ NEVER - Template literals with user input
const mongoQuery = { $where: `this.email == '${userInput}'` };

// ✅ ALWAYS - Parameterized queries for SQL
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [userInput]);

// ✅ ALWAYS - Proper MongoDB queries
const user = await User.findOne({ 
  email: { $eq: validatedEmail } // Use operators explicitly
});

// ✅ ALWAYS - Validate before querying
const EmailSchema = z.string().email();
const validatedEmail = EmailSchema.parse(userInput);
const user = await User.findOne({ email: validatedEmail });
```

### 5. XSS Prevention

```typescript
// ❌ NEVER - Direct HTML injection
app.get('/user/:id', (req, res) => {
  const user = await getUser(req.params.id);
  res.send(`<h1>Welcome ${user.name}</h1>`); // DANGEROUS
});

// ✅ ALWAYS - Sanitize and escape
import DOMPurify from 'isomorphic-dompurify';

app.get('/user/:id', (req, res) => {
  const user = await getUser(req.params.id);
  const safeName = DOMPurify.sanitize(user.name);
  res.json({ name: safeName }); // Let React handle rendering
});

// React Component - Auto-escapes by default
const UserProfile = ({ user }) => {
  return <h1>Welcome {user.name}</h1>; // Safe - React escapes
};

// If HTML is needed, sanitize first
const RichContent = ({ html }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: [],
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

### 6. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API rate limit
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 auth attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful requests
  message: 'Too many authentication attempts',
});

// Apply limiters
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Advanced: User-based rate limiting
const userRateLimiter = async (req, res, next) => {
  if (!req.user) return next();
  
  const key = `rate:${req.user.id}:${req.path}`;
  const limit = await getUserRateLimit(req.user.tier);
  
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  if (current > limit) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      retryAfter: await redis.ttl(key),
    });
  }
  
  next();
};
```

### 7. Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Avoid unsafe-inline in production
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

### 8. Audit Logging

```typescript
interface SecurityEvent {
  timestamp: Date;
  eventType: string;
  userId?: string;
  ip: string;
  userAgent: string;
  action: string;
  result: 'success' | 'failure';
  metadata?: Record<string, any>;
}

class AuditLogger {
  async log(event: SecurityEvent): Promise<void> {
    // Store in database
    await db.securityLogs.insert(event);
    
    // Alert on critical events
    if (this.isCriticalEvent(event)) {
      await this.sendSecurityAlert(event);
    }
    
    // Forward to SIEM if configured
    if (process.env.SIEM_ENDPOINT) {
      await this.forwardToSIEM(event);
    }
  }
  
  private isCriticalEvent(event: SecurityEvent): boolean {
    const criticalEvents = [
      'UNAUTHORIZED_ACCESS_ATTEMPT',
      'MULTIPLE_FAILED_LOGINS',
      'PRIVILEGE_ESCALATION_ATTEMPT',
      'DATA_BREACH_ATTEMPT',
      'SQL_INJECTION_ATTEMPT',
    ];
    
    return criticalEvents.includes(event.eventType);
  }
}

// Usage
const auditLogger = new AuditLogger();

// Log authentication attempts
app.post('/login', async (req, res) => {
  const result = await authenticate(req.body);
  
  await auditLogger.log({
    timestamp: new Date(),
    eventType: 'LOGIN_ATTEMPT',
    userId: result.userId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    action: 'login',
    result: result.success ? 'success' : 'failure',
    metadata: {
      failureReason: result.failureReason,
    },
  });
});
```

### 9. Error Handling

```typescript
// ❌ NEVER - Expose internal errors
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message, // Might expose sensitive info
    stack: err.stack,   // NEVER in production
  });
});

// ✅ ALWAYS - Safe error handling
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log full error internally
  logger.error({
    error: err,
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user?.id,
    },
  });
  
  // Send safe error to client
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }
  
  // Generic error for unexpected issues
  res.status(500).json({
    error: 'An unexpected error occurred',
    reference: generateErrorReference(), // For support
  });
};
```

### 10. Session Management

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JS access
    maxAge: 1000 * 60 * 30, // 30 minutes
    sameSite: 'strict', // CSRF protection
  },
  name: 'sessionId', // Don't use default name
  genid: () => {
    return crypto.randomBytes(32).toString('hex');
  },
}));

// Session invalidation on logout
app.post('/logout', (req, res) => {
  const sessionId = req.sessionID;
  
  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destruction failed', err);
    }
    
    // Also clear from Redis
    redisClient.del(`sess:${sessionId}`);
    
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });
  });
});
```

## 🔐 Environment Variables

```bash
# .env.example
# NEVER commit actual .env file

# Encryption
ENCRYPTION_KEY= # 32 bytes hex string
ENCRYPTION_ALGORITHM=aes-256-gcm

# JWT
JWT_SECRET= # Strong random string
JWT_EXPIRY=30m
JWT_REFRESH_SECRET= # Different from JWT_SECRET
JWT_REFRESH_EXPIRY=7d

# Session
SESSION_SECRET= # Strong random string

# Database
DB_CONNECTION_STRING= # With SSL required
DB_ENCRYPTION_KEY= # For at-rest encryption

# API Keys (use vault in production)
STRIPE_SECRET_KEY=
SENDGRID_API_KEY=
AWS_SECRET_ACCESS_KEY=

# Security
RATE_LIMIT_WINDOW=900000 # 15 minutes
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=12
MFA_REQUIRED=true

# Monitoring
SENTRY_DSN=
LOG_LEVEL=info
AUDIT_LOG_ENABLED=true
```

## 📊 Security Metrics

Track these metrics:

1. **Authentication**
   - Failed login attempts
   - Password reset requests
   - MFA adoption rate
   - Session duration

2. **Authorization**
   - Unauthorized access attempts
   - Permission escalation attempts
   - API key usage

3. **Data Protection**
   - Encryption coverage
   - Data access patterns
   - Sensitive data exposure

4. **Threats**
   - Injection attempts
   - XSS attempts
   - Rate limit violations
   - Anomalous behavior

## 🧪 Security Testing

### Automated Security Tests

```typescript
// security.test.ts
describe('Security Tests', () => {
  it('prevents SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const response = await api.post('/search', {
      query: maliciousInput,
    });
    
    expect(response.status).toBe(400);
    // Verify database is intact
    const users = await db.query('SELECT COUNT(*) FROM users');
    expect(users.count).toBeGreaterThan(0);
  });
  
  it('prevents XSS attacks', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await api.post('/profile', {
      bio: xssPayload,
    });
    
    const profile = await api.get('/profile');
    expect(profile.data.bio).not.toContain('<script>');
  });
  
  it('enforces rate limiting', async () => {
    const requests = Array(10).fill(null).map(() => 
      api.get('/api/data')
    );
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

## 🏁 Security Checklist

Before every deployment:

- [ ] All inputs validated with Zod schemas
- [ ] No TypeScript `any` without justification
- [ ] Authentication required on all protected routes
- [ ] Authorization checks for all operations
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Audit logging active
- [ ] Error messages don't leak information
- [ ] Dependencies updated (no known vulnerabilities)
- [ ] Security tests passing
- [ ] Code reviewed by security team
- [ ] Penetration test performed (quarterly)

---

**Remember:** Security is not a feature, it's a requirement. Every line of code is a potential vulnerability until proven otherwise.