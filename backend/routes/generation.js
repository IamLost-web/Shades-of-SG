const express = require('express')
const router = express.Router()
const generationController = require('../controllers/generationController')

// Placeholder authentication middleware
// TODO: Replace with global JWT middleware once Lia completes the Auth architecture
const requireAuth = (req, res, next) => {
  next()
}

// POST /api/generation/:id/generate
router.post('/:id/generate', requireAuth, generationController.startGeneration)

module.exports = router
