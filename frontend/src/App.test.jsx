import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the rhythm game landing page', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /rhythm game/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /play demo song/i })).toBeInTheDocument()
  })
})
