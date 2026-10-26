import { GESTURE_NAMES, OUTFIT_NAMES } from '@mascot'
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

describe('scene mascot', () => {
  it('assigns a cat gesture to every scene', () => {
    expect(scenes.map((scene) => [scene.id, scene.mascotGesture])).toEqual([
      ['prologue', 'sit'],
      ['city', 'sit'],
      ['hunter', 'lick'],
      ['arms', 'stretch'],
      ['hunts', 'idle'],
      ['lab', 'purr'],
      ['archive', 'sit'],
      ['raven', 'wave'],
      ['epilogue', 'sleep'],
    ])
  })

  it('dresses the cat as an inventor in the lab and a scholar in the archive', () => {
    expect(scenes.map((scene) => [scene.id, scene.mascotOutfit])).toEqual([
      ['prologue', 'hunter'],
      ['city', 'hunter'],
      ['hunter', 'hunter'],
      ['arms', 'hunter'],
      ['hunts', 'hunter'],
      ['lab', 'inventor'],
      ['archive', 'scholar'],
      ['raven', 'hunter'],
      ['epilogue', 'hunter'],
    ])
  })

  it('only uses known gestures and outfits', () => {
    for (const scene of scenes) {
      expect(GESTURE_NAMES).toContain(scene.mascotGesture)
      expect(OUTFIT_NAMES).toContain(scene.mascotOutfit)
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
