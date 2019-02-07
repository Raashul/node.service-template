'use strict';

const Admin = require(`${__base}/app/routes/config/acl/roles/Admin`);

const roles = {
  ADMIN: Admin.access
};

module.exports = roles;
