import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuditLog } from '../security-audit/auditLog.model.js';

const USERS = [
  { id: 'usr_admin', employeeId: 'ITO-ADMIN-01', passwordHash: '$2a$10$Xm57u8h9K6E.7N0XzKBCeeA4sI0Fq8vGgeC7IHe62wV1Yp0Y7fE2a', fullName: 'Founder Command Center', role: 'ADMIN', department: 'ADMIN' },
  { id: 'usr_sales', employeeId: 'ITO-SALES-01', passwordHash: '$2a$10$Xm57u8h9K6E.7N0XzKBCeeA4sI0Fq8vGgeC7IHe62wV1Yp0Y7fE2a', fullName: 'Satyam Front Facing Executive', role: 'SALES', department: 'STONE' }
];

export const loginUser = async (req, res, next) => {
  try {
    const { employeeId, password, deviceHash, ipAddress } = req.body;
    const user = USERS.find((u) => u.employeeId === employeeId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials input criteria', errorCode: 'AUTH_INVALID_CREDENTIALS' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await AuditLog.create({ actorId: employeeId, actionType: 'LOGIN_FAILED', entityType: 'USER', entityId: user.id, ipAddress, deviceHash, severity: 'HIGH' });
      return res.status(401).json({ success: false, message: 'Invalid credentials input criteria', errorCode: 'AUTH_INVALID_CREDENTIALS' });
    }

    const token = jwt.sign(
      { id: user.id, employeeId: user.employeeId, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    await AuditLog.create({ actorId: user.employeeId, actionType: 'LOGIN_SUCCESS', entityType: 'USER', entityId: user.id, ipAddress, deviceHash, severity: 'LOW' });

    res.json({
      success: true,
      message: 'Authentication validated successfully',
      data: {
        accessToken: token,
        user: { id: user.id, employeeId: user.employeeId, fullName: user.fullName, role: user.role, department: user.department }
      }
    });
  } catch (error) {
    next(error);
  }
};
