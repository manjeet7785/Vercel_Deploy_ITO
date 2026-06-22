const Role = require('./role.model');

async function hasPermission(roleName, permissionKey) {
  const roleObj = await Role.findOne({ name: roleName });
  if (!roleObj) return false;
  return roleObj.permissions.includes(permissionKey);
}

async function seedRoles() {
  const defaultRoles = [
    {
      name: 'ADMIN',
      description: 'Super User / Founder',
      level: 100,
      permissions: ['lead:read', 'lead:write', 'lead:assign', 'lead:delete', 'quotation:approve', 'quotation:reject', 'export:leads', 'security:read', 'employee:manage']
    },
    {
      name: 'MANAGER',
      description: 'Department Manager',
      level: 80,
      permissions: ['lead:read', 'lead:write', 'lead:assign', 'quotation:read', 'security:read']
    },
    {
      name: 'SALES',
      description: 'Sales Executive',
      level: 50,
      permissions: ['lead:read', 'lead:write', 'quotation:request']
    },
    {
      name: 'PROCUREMENT',
      description: 'Procurement Specialist',
      level: 50,
      permissions: ['lead:read', 'dispatch:write']
    },
    {
      name: 'ACCOUNTS',
      description: 'Accounts Clerk',
      level: 50,
      permissions: ['lead:read', 'payment:write']
    },
    {
      name: 'HR',
      description: 'Human Resources',
      level: 50,
      permissions: ['employee:manage']
    },
    {
      name: 'IT',
      description: 'System IT Officer',
      level: 50,
      permissions: ['security:read']
    }
  ];

  for (const roleData of defaultRoles) {
    await Role.findOneAndUpdate(
      { name: roleData.name },
      roleData,
      { upsert: true, new: true }
    );
  }
}

module.exports = { hasPermission, seedRoles };
