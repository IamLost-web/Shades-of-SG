# Shades of SG - AI Development Journal

## Purpose

This document records significant AI-assisted development activities throughout the project.

The objective is to provide:

* Transparency
* Traceability
* Evidence of human oversight
* Evidence of iterative improvement

This document should be updated whenever AI contributes to architecture, design, implementation, debugging, testing, or documentation.

---

# Entry Template

## Date

YYYY-MM-DD

## Feature

Feature name

## AI Tool Used

Examples:

* Codex
* ChatGPT
* Claude
* Gemini

## Objective

What problem was being solved?

## Prompt Summary

High-level summary of prompt provided to AI.

Do NOT need entire chat history.

Example:

"Generate React component structure for reflection wall with CRUD support."

## AI Output Summary

What did the AI generate?

Examples:

* Component scaffold
* API endpoints
* Database schema
* Test cases
* UI layout
* Refactoring suggestions

## Human Review

Was the output accepted?

* Fully accepted
* Partially accepted
* Rejected

## Human Modifications

Describe changes made after AI generation.

Example:

* Added moderation status.
* Removed redundant API call.
* Simplified state management.

## Final Outcome

Short summary of final implemented solution.

---

# Project Entries

## 2026-06-14

### Feature

Project Architecture

### AI Tool Used

ChatGPT

### Objective

Create initial system architecture.

### Prompt Summary

Generate architecture for AI-powered music storytelling platform using React, Express, PostgreSQL, and Cloudinary.

### AI Output Summary

Generated modular monolith architecture and deployment proposal.

### Human Review

Partially accepted.

### Human Modifications

Removed unnecessary complexity and standardized deployment stack.

### Final Outcome

Architecture incorporated into HIGH_LEVEL_DESIGN.md.

---

## 2026-06-14

### Feature

Project Timeline

### AI Tool Used

ChatGPT

### Objective

Create implementation roadmap.

### Prompt Summary

Generate phased implementation plan with ownership allocation.

### AI Output Summary

Generated Phase 0-3 roadmap.

### Human Review

Accepted with minor edits.

### Human Modifications

Adjusted task ownership and timelines.

### Final Outcome

PROJECT_IMPLEMENTATION_PHASE.md completed.

---

## 2026-06-14

### Feature

Rhythm Game MVP, Video Gameplay Background, and Results Page Integration

### AI Tool Used

Codex

### Objective

Build the first complete rhythm game flow for Shades of SG so that a user can move from a song into gameplay, play a four-lane rhythm chart, view performance results, and continue into reflection.

The goal was not only to create a standalone rhythm game, but to make it feel like part of the wider Shades of SG experience:

* Experience song
* Choose difficulty
* Play rhythm game
* View results
* Write reflection
* Return to the song page or replay

### Prompt Summary

Ferlyn provided the feature direction in several stages:

* Asked whether rhythm game code could be built using an MP3 as an example song and Rhythm Plus as the gameplay reference.
* Shared Rhythm Plus screenshots and a recorded gameplay video as the target interaction style.
* Defined four implementation tickets:
  * Create `RhythmGame.jsx` with four lanes, `D F J K` keys, canvas rendering, falling notes, combo counter, and score counter.
  * Create a beatmap loading system that loads JSON beatmaps by song id, supports Easy/Medium/Hard, and uses timestamps in seconds.
  * Create a results page with accuracy, max combo, score, and rank `S A B C`.
  * Integrate with the existing song system by reading `songId` from the route parameter and saving scores to `POST /api/scores`.
* Asked for the gameplay page to use the song's generated video as a fullscreen background, with a dark overlay and readable rhythm lanes above it.
* Requested support for AI-generated music videos by fetching song details from the API and reading `video_url`.
* Requested temporary use of the Exploding Kittens MP4 from the project videos folder as the placeholder gameplay background.
* Reviewed the first layout and asked for it to look closer to Rhythm Plus:
  * Game board centered.
  * Controls separated from gameplay.
  * UI elements not stacked on top of each other.
  * Lane labels easier to read.
  * Rhythm game tile area stretched to the full screen height.
* Asked for a pre-game overlay showing song title, difficulty, and Start button.
* Asked for countdown states `3`, `2`, `1`, `GO` before notes begin.
* Asked for falling notes to stay hidden until gameplay starts.
* Asked for the spacebar to pause and resume the game with a pause menu overlay.
* Reviewed the results page and requested better Shades of SG platform integration:
  * Add song title.
  * Add song thumbnail.
  * Add Reflection CTA.
  * Add `Write Reflection`, `Back to Song`, and `Play Again` actions.
  * Add a performance breakdown for Perfect hits, Good hits, Misses, and accuracy.
  * Do not modify scoring logic while improving the page.

### AI Output Summary

Codex generated and iterated on the rhythm game implementation across frontend, backend, data, and styling files.

Frontend gameplay work:

* Created `frontend/src/components/RhythmGame.jsx`.
* Implemented a four-lane rhythm game using the `D`, `F`, `J`, and `K` keyboard inputs.
* Used HTML canvas rendering for lanes, notes, hit line, lane labels, and visual feedback.
* Added falling notes driven by beatmap timestamps in seconds.
* Added scoring, combo, max combo, accuracy, and hit judgement tracking.
* Added hit windows for Perfect, Great, Good, and Miss results.
* Added game state handling for ready, countdown, playing, paused, and finished states.
* Added a pre-game overlay with song title, difficulty, and Start button.
* Added countdown display before gameplay begins.
* Prevented notes from appearing before the Start action and countdown.
* Added spacebar pause/resume behavior and a pause overlay.
* Added keyboard event cleanup to avoid duplicate listeners.

Beatmap and song loading work:

* Created `frontend/src/game/beatmapLoader.js`.
* Created `frontend/public/beatmaps/demo-song.json`.
* Added support for loading beatmaps from `/beatmaps/{songId}.json`.
* Added Easy, Medium, and Hard chart support.
* Standardized note timing around timestamps in seconds.
* Created `frontend/src/game/songDetailsApi.js` to fetch song details by route parameter.
* Added support for reading both `video_url` and `videoUrl` style properties so the frontend can work with current and future API shapes.

Video background work:

* Added the placeholder video at `frontend/public/videos/exploding-kittens-placeholder.mp4`.
* Made the gameplay video fullscreen and placed it as the bottom layer.
* Added a dark overlay above the video at about 70 percent opacity.
* Kept the canvas rhythm board, controls, and overlays above the video layer.
* Used `object-fit: cover` so the video covers mobile, tablet, and desktop screens.
* Added fallback behavior so the existing gradient background remains available if the video cannot load.
* Synchronized gameplay start with video playback after countdown.
* Paused the video when the game is paused.
* Stopped the video when the chart is completed.
* Navigated to the Results page after the game completes.

Results page work:

* Created `frontend/src/pages/RhythmResults.jsx`.
* Created `frontend/src/game/results.js`.
* Added rank display for `S`, `A`, `B`, and `C`.
* Preserved scoring logic while improving the page hierarchy.
* Added song title, theme, and thumbnail context.
* Added score, accuracy, max combo, and rank cards.
* Added performance breakdown:
  * Perfect hits
  * Good hits
  * Misses
  * Accuracy percentage
* Added a highlighted Reflection CTA with the prompt: "What memories did this song bring back?"
* Added actions for `Write Reflection`, `Play Again`, and `Back To Song`.

Backend integration work:

* Added `backend/routes/scores.js` for score submission through `POST /api/scores`.
* Added `backend/routes/songs.js` for fetching song data by id.
* Mounted the routes in `backend/server.js`.
* Updated `backend/models/GameScore.js` so saved scores can include rhythm game result metadata.
* Updated `backend/migrations/001_initial_schema.sql` to support max combo and rank fields.

Routing and app integration work:

* Updated `frontend/src/App.jsx` with rhythm game and results routes.
* Wired gameplay to read `songId` from the URL route parameter.
* Passed gameplay result state to the Results page.
* Added score saving after gameplay through `POST /api/scores`.
* Added fallback behavior for direct Results page access when route state is missing.

Styling and layout work:

* Updated `frontend/src/App.css` and `frontend/src/index.css`.
* Refactored the rhythm page into clear layout layers:
  * Background video layer.
  * Dark overlay layer.
  * Gameplay board layer.
  * Control and HUD layer.
  * Pre-game, countdown, and pause overlay layers.
* Centered the game board horizontally and vertically.
* Stretched the rhythm lane area to the full viewport height.
* Improved lane label readability.
* Increased note contrast so notes remain visible over video.
* Moved controls outside the core gameplay area.
* Added responsive handling for tablet-sized screens.

### Human Review

Partially accepted through multiple rounds of review and refinement.

Ferlyn approved the overall direction but repeatedly corrected the implementation details so that the feature matched the intended Rhythm Plus style and the Shades of SG project flow. The final result was shaped by both AI implementation and human design review.

### Human Modifications and Inputs

Ferlyn's inputs directly changed the feature direction in the following ways:

* Chose Rhythm Plus as the primary gameplay reference.
* Provided an MP3 example to explain the expected rhythm game concept.
* Provided a gameplay recording and screenshots to show the desired end goal.
* Split the feature into implementation tickets, which made the build more structured.
* Clarified that the game should integrate with the existing song system through `songId`.
* Clarified that scores should be saved to `POST /api/scores`.
* Requested a fullscreen generated video background instead of a plain game background.
* Requested a placeholder MP4 first, with the intention of replacing it later using `song.videoUrl` or `video_url` from the API.
* Identified that the original difficulty selector placement was not ideal and should belong before gameplay.
* Pointed out layout issues:
  * Play button overlapping Ready text.
  * Board not perfectly centered.
  * UI elements stacking on top of each other.
  * Lane labels being hard to read.
* Requested stronger background layering because the video was distracting and gameplay elements blended into it.
* Requested the lane area to stretch to the full screen height.
* Requested a pre-game overlay and countdown so gameplay starts intentionally.
* Requested spacebar pause and resume behavior for laptop users.
* Reviewed the Results page and redirected it from a generic "Game Finished" page into a Shades of SG reflection bridge.
* Requested that results include song context, reflection CTA, and performance breakdown without changing the scoring logic.

### Final Outcome

The rhythm game is now a functional MVP feature inside Shades of SG.

The current flow supports:

* Loading a song by route parameter.
* Fetching song details.
* Loading a beatmap by song id.
* Selecting difficulty support through Easy/Medium/Hard beatmap data.
* Starting gameplay from a pre-game overlay.
* Showing countdown before notes spawn.
* Playing a four-lane canvas rhythm game with `D F J K`.
* Pausing and resuming with the spacebar.
* Using a fullscreen video background with a dark overlay.
* Saving score data to the backend.
* Navigating to an integrated Results page.
* Encouraging the user to continue into reflection after gameplay.

### Verification

The implementation was checked with frontend and backend commands during development:

* `npm run lint --prefix frontend`
* `npm run test --prefix frontend`
* `npm run build --prefix frontend`
* `npm run lint --prefix backend`
* `npm run test --prefix backend`

Manual route checks were also performed for the gameplay and results pages:

* `/game/demo-song`
* `/game/demo-song/results`

### Known Limitations and Future Work

The feature is suitable for an MVP demo, but several items should be improved later:

* The current beatmap is manually generated demo data, not automatically detected from the MP3.
* The video background currently uses a placeholder MP4 and should later use the real AI-generated song video from the song record.
* Difficulty selection should ideally happen on the song page before entering gameplay.
* The Reflection Wall and Reflection Submission Modal should be connected next.
* Future result enhancements could include badge unlocks and a Next Song action.

---

# AI Usage Summary

## Architecture

AI-Assisted

Human-Reviewed

## Database Design

AI-Assisted

Human-Modified

## Frontend Development

AI-Assisted

Human-Reviewed

## Backend Development

AI-Assisted

Human-Reviewed

## Testing

AI-Assisted

Human-Reviewed

## Documentation

AI-Assisted

Human-Reviewed

---

# Reflection

## What AI Did Well

AI helped turn a broad feature idea into a working rhythm game implementation quickly. It translated Ferlyn's tickets into concrete frontend components, backend routes, beatmap files, result calculations, and UI states.

AI was also useful for iteration. When Ferlyn pointed out layout and readability issues, AI refactored the gameplay page into clearer layers, improved the video overlay, separated controls from the gameplay board, and made the Results page feel more connected to Shades of SG.

AI also helped keep the work traceable by running linting, tests, builds, and route checks after implementation.

## What AI Did Poorly

The first rhythm game layouts were too close to a generic web game and not close enough to the Rhythm Plus reference. The play button, ready text, controls, and board layout needed human correction before the page felt usable.

The first video background attempt also needed refinement because the video distracted from gameplay. Ferlyn had to clarify that the video should stay visible but must not reduce note readability.

The current beatmap is still manual demo data. AI did not implement real audio analysis or automatic note generation from the MP3.

## Human Contributions

Ferlyn provided the feature vision, Rhythm Plus reference, MP3 example, gameplay recording, screenshots, acceptance criteria, and multiple rounds of design review.

Ferlyn made the key product decisions:

* The game should support `D F J K`.
* Beatmaps should load by song id and difficulty.
* Gameplay should use generated song videos as fullscreen backgrounds.
* The Results page should connect to reflection, not just end the game.
* Scoring logic should stay stable while the Results page UI improves.

Ferlyn's feedback directly corrected UI hierarchy, layering, pause behavior, countdown behavior, and platform integration.

## Lessons Learned

For this project, a rhythm game feature should not be treated as a separate mini-game. It needs to support the wider Shades of SG journey: listen, play, understand, and reflect.

Visual polish matters most when it improves readability and flow. The most important changes were not fancy effects, but clear layering, centered gameplay, visible notes, intentional start state, pause support, and a meaningful Results page that leads to Reflection Wall work.

Human review was essential because the AI could implement mechanics, but Ferlyn's references and product judgement determined whether the feature actually matched the intended experience.
