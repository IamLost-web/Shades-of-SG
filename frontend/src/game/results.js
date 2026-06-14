export function calculateAccuracy(hits, totalNotes) {
  if (totalNotes === 0) {
    return 0
  }

  return Math.round((hits / totalNotes) * 100)
}

export function getRank(accuracy) {
  if (accuracy >= 95) {
    return 'S'
  }

  if (accuracy >= 85) {
    return 'A'
  }

  if (accuracy >= 70) {
    return 'B'
  }

  return 'C'
}

export function createResult({
  accuracy,
  difficulty,
  goodHits = 0,
  maxCombo,
  misses = 0,
  perfectHits = 0,
  score,
  songId,
  totalNotes,
}) {
  return {
    accuracy,
    difficulty: difficulty.toUpperCase(),
    goodHits,
    maxCombo,
    misses,
    playedAt: new Date().toISOString(),
    perfectHits,
    rank: getRank(accuracy),
    score,
    songId,
    totalNotes,
  }
}

export function readStoredResult(songId) {
  const stored = localStorage.getItem(`rhythmResult:${songId}`)
  return stored ? JSON.parse(stored) : null
}

export function storeResult(result) {
  localStorage.setItem(`rhythmResult:${result.songId}`, JSON.stringify(result))
}
