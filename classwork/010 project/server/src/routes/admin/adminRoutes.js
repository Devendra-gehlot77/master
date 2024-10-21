const express = require('express');
const { testAdmin, adminLogin } = require('../../controllers/controllers');
const adminRoutes = express.Router();

adminRoutes.get('/test-admin', testAdmin); // http://localhost:4000/api/admin-panel/test-admin
adminRoutes.post('/login', adminLogin) // http://localhost:4000/api/admin-panel/login

module.exports = { adminRoutes };