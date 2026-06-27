const aiScenePlanner = require('../services/aiScenePlanner')
const { GenerationJob } = require('../models')

exports.startGeneration = async (req, res, next) => {
  try {
    const songId = req.params.id

    // 1. Check for overlapping jobs to prevent duplicate API burning
    const existingJob = await GenerationJob.findOne({
      where: { songId, status: 'IN_PROGRESS' },
    })

    if (existingJob) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A generation job is already in progress for this song.',
      })
    }

    // 2. Initialize a new Generation Job record
    const job = await GenerationJob.create({
      songId,
      status: 'IN_PROGRESS',
    })

    // 3. Kick off the asynchronous process (Note: NO await here!)
    aiScenePlanner
      .generateScenePlan(songId)
      .then(async () => {
        // Successfully finished generating and saving scenes
        await job.update({ status: 'COMPLETED' })
      })
      .catch(async (error) => {
        // Caught an error (e.g., API timeout, bad parsing, missing DB record)
        console.error(`[AI Pipeline Error] Song ${songId}:`, error)
        await job.update({
          status: 'FAILED',
          errorMessage: error.message || 'An unknown error occurred during AI generation.',
        })
      })

    // 4. Return immediately to the client
    return res.status(202).json({
      message: 'Scene generation job started successfully.',
      jobId: job.id,
    })
  } catch (error) {
    // Only catches synchronous controller errors (e.g., DB failure when creating the job)
    next(error)
  }
}
