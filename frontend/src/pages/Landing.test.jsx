import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Landing from './Landing'

const mocks = vi.hoisted(() => ({
  getPublishedSongs: vi.fn(),
  getReflections: vi.fn(),
}))

vi.mock('../services/publicSongService', () => ({ getPublishedSongs: mocks.getPublishedSongs }))
vi.mock('../services/reflectionService', () => ({ getReflections: mocks.getReflections }))

describe('Landing community statistics', () => {
  beforeEach(() => {
    mocks.getPublishedSongs.mockResolvedValue([])
    mocks.getReflections.mockResolvedValue([])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ reflectionsCount: 9, songsCount: 6, usersCount: 14 }),
      ok: true,
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    cleanup()
  })

  it('renders the latest statistics returned by the database API', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>)

    expect(await screen.findByText('14 Active Explorers')).toBeInTheDocument()
    expect(screen.getByText('6 Heritage Songs')).toBeInTheDocument()
    expect(screen.getByText('9 Stories Shared')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/stats$/))
  })
})
