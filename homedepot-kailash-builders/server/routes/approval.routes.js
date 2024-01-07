const express = require('express')
const router = express.Router()
const ApprovalController = require('../controllers/approval.controller')
const { verifyAccessToken,isAdmin, isUser } = require('../helpers/jwtHelper')

router.post('/approval',[verifyAccessToken, isAdmin], ApprovalController.register)
router.get('/approval/get',[verifyAccessToken, isUser], ApprovalController.get_Approval)
router.put('/approval/delete/:id',[verifyAccessToken, isUser], ApprovalController.delete_approval)
router.put('/approve/:id',[verifyAccessToken, isAdmin], ApprovalController.approve_Approval)

module.exports = router