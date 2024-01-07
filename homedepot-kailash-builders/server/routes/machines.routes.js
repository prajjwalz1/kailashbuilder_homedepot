const express = require('express')
const router = express.Router()
const MachineController = require('../controllers/machines.controller')
const { verifyAccessToken,isUser,isAdmin } = require('../helpers/jwtHelper')

router.post('/machine',[verifyAccessToken, isAdmin], MachineController.register)
router.get('/machine/get',[verifyAccessToken, isUser], MachineController.get_machine)
router.get('/machine/get/:id',[verifyAccessToken, isUser], MachineController.get_machine_by_id)
router.put('/machine/delete/:id',[verifyAccessToken, isAdmin], MachineController.delete_machine)
router.put('/machine/edit/:id',[verifyAccessToken,isAdmin], MachineController.edit_machine)

module.exports = router