/******************************************************
 * Created by nanyuantingfeng on 2018/9/4 12:55.
 *****************************************************/
import PointCellar from '../PointCellar'

describe('PointCellar', () => {
  test('has/get/push*/clear*', () => {
    const cache = new PointCellar()

    expect(cache.has('0')).toBe(false)
    expect(cache.has('0', '1')).toBe(false)

    cache.push('a', { key: 0 })
    expect(cache.has('a')).toBe(true)

    cache.push('a', { key: 1 })
    cache.push('a', { key: 2 }, 'ccc')

    expect(cache.get('a')).toEqual([{ key: 0 }, { key: 1 }, { key: 2 }])
    expect(cache.get('a', 'ccc')).toEqual([{ key: 2 }])

    cache.push('a', { key: 3 }, 'ccc')
    expect(cache.get('a', 'ccc')).toEqual([{ key: 2 }, { key: 3 }])

    cache.push('a', { key: 99 }, 'ddd')
    expect(cache.get('a')).toEqual([{ key: 0 }, { key: 1 }, { key: 2 }, { key: 3 }, { key: 99 }])
    expect(cache.get('a', 'ddd')).toEqual([{ key: 99 }])
    expect(cache.get('a', 'ccc')).toEqual([{ key: 2 }, { key: 3 }])

    cache.clearNS('a', 'ccc')
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(true)

    cache.clearNS('a')
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(true)

    cache.clearAll('a')
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(false)

    cache.clearAll()
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(false)
  })

  test('has/get/set*/clear*', () => {
    const cache = new PointCellar()

    expect(cache.has('0')).toBe(false)
    expect(cache.has('0', '1')).toBe(false)

    cache.set('a', { key: 0 })
    expect(cache.has('a')).toBe(true)
    expect(cache.get('a')).toEqual([{ key: 0 }])

    cache.set('a', { key: 1 })
    cache.set('a', { key: 2 }, 'ccc')

    expect(cache.get('a')).toEqual([{ key: 1 }, { key: 2 }])
    expect(cache.get('a', 'ccc')).toEqual([{ key: 2 }])

    cache.set('a', { key: 3 }, 'ccc')
    expect(cache.get('a', 'ccc')).toEqual([{ key: 3 }])

    cache.set('a', { key: 99 }, 'ddd')
    expect(cache.get('a')).toEqual([{ key: 1 }, { key: 3 }, { key: 99 }])
    expect(cache.get('a', 'ddd')).toEqual([{ key: 99 }])
    expect(cache.get('a', 'ccc')).toEqual([{ key: 3 }])

    cache.clearNS('a', 'ccc')
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(true)

    cache.clearNS('a')
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(true)

    cache.clearAll('a')
    expect(cache.has('a', 'ccc')).toBe(false)
    expect(cache.has('a')).toBe(false)
  })
})
