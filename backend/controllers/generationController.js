const { GenerationJob, Song } = require('../models')
const { cleanupJobFiles } = require('../services/cleanupService') // IMPORT ADDED HERE

/**
 * Retrieves all generation jobs, including their associated song titles.
 */
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await GenerationJob.findAll({
      include: [
        {
          model: Song,
          as: 'song',
          attributes: ['title'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    const formattedJobs = jobs.map((job) => {
      const plainJob = job.get({ plain: true })
      return {
        ...plainJob,
        Song: plainJob.song,
      }
    })

    return res.status(200).json({
      success: true,
      data: formattedJobs,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves the live status of a specific generation job.
 */
const getGenerationStatus = async (req, res, next) => {
  try {
    const { id } = req.params

    const job = await GenerationJob.findByPk(id, {
      include: [
        {
          model: Song,
          as: 'song',
          attributes: ['title'],
        },
      ],
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    const plainJob = job.get({ plain: true })

    return res.status(200).json({
      success: true,
      data: {
        status: plainJob.status,
        errorMessage: plainJob.errorMessage,
        Song: plainJob.song,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * The background video generation pipeline (Phase 5 Cleanup injected here)
 */
const runGenerationPipeline = async (jobId) => {
  console.log(`[Background Worker] Starting generation pipeline for Job ID: ${jobId}...`)

  try {
    // ==========================================
    // YOUR ASYNC AI PIPELINE RUNS HERE
    // - Extract audio from URL/MP3
    // - Generate Scene Plans (LLM)
    // - Generate Image Frames (Text-to-Image)
    // - Assemble via FFmpeg
    // - Upload to Cloudinary
    // ==========================================

    // Update DB on Success
    await GenerationJob.update(
      { status: 'COMPLETED', progress: 100, errorMessage: null },
      { where: { id: jobId } }
    )

    // Run Cleanup on successful completion
    await cleanupJobFiles(jobId)
  } catch (error) {
    console.error(`[Generation Pipeline Error] Job ${jobId}:`, error)

    // ---------------------------------------------------------
    // THE CLEANUP CREW & ERROR BOUNDARY (Phase 5 Requirement)
    // ---------------------------------------------------------
    try {
      if (jobId) {
        // Database Update: Set to FAILED and record the exact error
        await GenerationJob.update(
          {
            status: 'FAILED',
            errorMessage: error.message,
          },
          { where: { id: jobId } }
        )

        // File Wiping: Remove half-baked temporary files so they don't bloat the server
        await cleanupJobFiles(jobId)
      }
    } catch (fallbackError) {
      // Catch edge cases where the DB is entirely unreachable
      console.error(
        `[Fallback Failure] Could not update DB or wipe files for Job ${jobId}:`,
        fallbackError
      )
    }
  }
}

/**
 * Initiates the AI generation process.
 * Responds immediately to the client while the heavy lifting runs in the background.
 */
const startGeneration = async (req, res, next) => {
  try {
    const { songId } = req.body

    if (!songId) {
      return res.status(400).json({
        success: false,
        message: 'songId is required to start the generation process.',
      })
    }

    const newJob = await GenerationJob.create({
      songId: songId,
      status: 'PROCESSING',
      progress: 10,
    })

    // The Background Trigger (No await - runs `runGenerationPipeline` asynchronously)
    runGenerationPipeline(newJob.id).catch((err) => {
      console.error(`[Background Worker Error] Job ID ${newJob.id}:`, err)
    })

    return res.status(202).json({
      success: true,
      jobId: newJob.id,
    })
  } catch (error) {
    // Global Error Handoff for controller/request errors
    next(error)
  }
}

module.exports = {
  getAllJobs,
  getGenerationStatus,
  startGeneration,
  runGenerationPipeline,
}
