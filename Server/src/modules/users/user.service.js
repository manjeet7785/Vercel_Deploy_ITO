const User = require('./user.model');
const bcrypt = require('bcryptjs');

async function createUser(data) {
  const passwordHash = await bcrypt.hash(data.password || 'ItoPass123!', 10);
  return User.create({
    employeeId: data.employeeId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    passwordHash,
    role: data.role || 'SALES',
    department: data.department || 'SALES',
    isActive: true,
    createdBy: data.createdBy || null
  });
}

async function listAllUsers() {
  return User.find().select('-passwordHash').sort({ createdAt: -1 });
}

async function getUserById(id) {
  return User.findById(id).select('-passwordHash');
}

async function activateUser(id) {
  return User.findByIdAndUpdate(id, { isActive: true }, { new: true }).select('-passwordHash');
}

async function updateUserRole(id, role) {
  return User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-passwordHash');
}

async function updateUserDepartment(id, department) {
  return User.findByIdAndUpdate(
    id,
    { department },
    { new: true, runValidators: true }
  ).select('-passwordHash');
}

async function updateUserPermissions(id, permissions) {
  return User.findByIdAndUpdate(
    id,
    permissions,
    { new: true, runValidators: true }
  ).select('-passwordHash');
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id).select('-passwordHash');
}

async function deactivateUser(id) {
  return User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-passwordHash');
}

module.exports = {
  createUser,
  listAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  updateUserRole,
  updateUserDepartment,
  updateUserPermissions,
  deleteUser
};
