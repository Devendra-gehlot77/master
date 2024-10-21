const express = require('express');
const { createSize,
    readSize,
    updateStatusSize,
    deleteSize,
    deleteSizes,
    sizeByID,
    updateSize,
    deletedSizes,
    recoverSize } = require('../../controllers/controllers');

const sizeRouter = express.Router();

sizeRouter.post('/create-size', createSize);
sizeRouter.get('/read-sizes', readSize);
sizeRouter.put('/update-status/:_id', updateStatusSize)
sizeRouter.put('/delete-size/:_id', deleteSize);
sizeRouter.put('/delete-sizes', deleteSizes);
sizeRouter.get('/read-size/:_id', sizeByID);
sizeRouter.put('/update-size/:_id', updateSize);
sizeRouter.get('/deleted-sizes', deletedSizes);
sizeRouter.put('/recover-size/:_id', recoverSize);

module.exports = sizeRouter;