const express = require('express');
const { adminRoutes } = require('./admin/adminRoutes');
const parentCategoryRouter = require('./admin/parentCategoryRoutes');
const colorRoutes = require('./admin/colorRoutes');
const sizeRouter = require('./admin/sizeRoutes');
const productCategoryRoutes = require('./admin/productCategoryRoutes');
const productRoutes = require('./admin/productRoutes');

const adminPanelRoutes = express.Router();
const websiteRoutes = express.Router();
const appRoutes = express.Router();

adminPanelRoutes.use('/admin', adminRoutes);
adminPanelRoutes.use('/parent-category', parentCategoryRouter);
adminPanelRoutes.use('/color', colorRoutes);
adminPanelRoutes.use('/size', sizeRouter);
adminPanelRoutes.use('/product-category', productCategoryRoutes);
adminPanelRoutes.use('/product', productRoutes);


module.exports = { adminPanelRoutes, websiteRoutes, appRoutes };