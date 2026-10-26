import { describe, expect, it } from 'vitest'
import { chapters, scenes } from './registry'

describe('scenes', () => {
  it('lists the story in order', () => {
    expect(scenes.map((scene) => scene.id)).toEqual([
      'prologue',
      'city',
      'hunter',
      'arms',
      'hunts',
      'lab',
      'archive',
      'raven',
      'epilogue',
    ])
  })

  it('has unique anchors', () => {
    const anchors = scenes.map((scene) => scene.anchor)
    expect(new Set(anchors).size).toBe(anchors.length)
  })

  it('keeps every scene at least one viewport tall', () => {
    for (const scene of scenes) {
      expect(scene.lengthVh).toBeGreaterThanOrEqual(100)
    }
  })

  it('gives chaptered scenes a title key', () => {
    for (const scene of scenes) {
      if (scene.chapter) {
        expect(scene.titleKey).toBe(`journal.chapters.${scene.id}.title`)
      }
    }
  })
})

describe('chapters', () => {
  it('derives chapters I to V in order', () => {
    expect(chapters.map((chapter) => chapter.chapter)).toEqual(['I', 'II', 'III', 'IV', 'V'])
    expect(chapters.map((chapter) => chapter.id)).toEqual([
      'hunter',
      'arms',
      'hunts',
      'lab',
      'raven',
    ])
  })

  it('exposes the anchor and title key for the bookmark rail', () => {
    expect(chapters[0]).toEqual({
      id: 'hunter',
      chapter: 'I',
      anchor: 'about',
      titleKey: 'journal.chapters.hunter.title',
    })
  })
})
