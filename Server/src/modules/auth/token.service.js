const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');
const RefreshToken = require('./refreshToken.model');

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRY } 
  );
}

async function generateRefreshToken(user) {
  const tokenString = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); 

  const refreshToken = await RefreshToken.create({
    token: tokenString,
    userId: user._id,
    expiresAt,
    isRevoked: false
  });

  return refreshToken.token;
}

async function rotateRefreshToken(oldTokenString) {
  const tokenDoc = await RefreshToken.findOne({ token: oldTokenString, isRevoked: false });
  if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  
  tokenDoc.isRevoked = true;
  await tokenDoc.save();

  
  const tokenString = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: tokenString,
    userId: tokenDoc.userId,
    expiresAt,
    isRevoked: false
  });

  return {
    userId: tokenDoc.userId,
    newRefreshToken: tokenString
  };
}

async function revokeRefreshToken(tokenString) {
  await RefreshToken.findOneAndUpdate({ token: tokenString }, { isRevoked: true });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken
};
