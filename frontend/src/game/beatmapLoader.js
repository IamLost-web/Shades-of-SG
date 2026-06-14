const DIFFICULTIES = ['easy', 'medium', 'hard']

function normalizeNotes(notes = []) {
  return notes
    .filter((note) => Number.isFinite(note.time) && Number.isInteger(note.lane))
    .map((note, index) => ({
      id: `${note.time}-${note.lane}-${index}`,
      lane: Math.min(Math.max(note.lane, 0), 3),
      status: 'pending',
      time: note.time,
    }))
    .sort((a, b) => a.time - b.time)
}

export async function loadBeatmap(songId, difficulty) {
  const safeDifficulty = DIFFICULTIES.includes(difficulty) ? difficulty : 'easy'
  const response = await fetch(`/beatmaps/${encodeURIComponent(songId)}.json`)

  if (!response.ok) {
    throw new Error(`Beatmap not found for song ${songId}`)
  }

  const beatmap = await response.json()
  const notes = normalizeNotes(beatmap.difficulties?.[safeDifficulty])

  if (notes.length === 0) {
    throw new Error(`No ${safeDifficulty} notes found for song ${songId}`)
  }

  return {
    artist: beatmap.artist || 'Unknown artist',
    audioUrl: beatmap.audioUrl || '',
    difficulty: safeDifficulty,
    notes,
    songId: beatmap.songId || songId,
    title: beatmap.title || 'Untitled song',
  }
}

export { DIFFICULTIES }
