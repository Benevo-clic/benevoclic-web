import { describe, it, expect } from 'vitest'

describe('Simple Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle strings', () => {
    expect('hello').toBe('hello')
  })
}) 