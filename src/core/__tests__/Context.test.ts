/*************************************************
 * Created by nanyuantingfeng on 2018/7/11 13:04.
 * ***********************************************/
import Context from '../Context'
import { Whispered } from '../../types'
type IPlugin = Whispered.Plugin

describe('Context LifeCycle API', () => {
  test('should call onfirst', async () => {
    const ctx = new Context()
    const onfirst = jest.fn(() => undefined)
    const onfirst2 = jest.fn(() => undefined)
    const onload = jest.fn(() => undefined)

    ctx
      .use({
        id: 'xxx',
        onfirst
      })
      .use({
        id: 'yyy',
        onload,
        onfirst: onfirst2,
        dependencies: ['xxx']
      })

    await ctx.callback(async () => {})

    // @ts-ignore
    await ctx.loadOne('yyy')
    // @ts-ignore
    await ctx.loadOne('yyy')
    // @ts-ignore
    await ctx.loadOne('yyy')
    // @ts-ignore
    await ctx.loadOne('yyy')

    // @ts-ignore
    expect(ctx._didonfirstmap.has('xxx')).toBe(true)
    // @ts-ignore
    expect(ctx._didonfirstmap.has('yyy')).toBe(true)

    expect(onload).toBeCalled()
    expect(onfirst).toBeCalled()
    expect(onfirst).toBeCalledWith(ctx)
    expect(onfirst.mock.calls.length).toBe(1)
    expect(onfirst2.mock.calls.length).toBe(1)
  })

  test('should call onload', async () => {
    const ctx = new Context()
    const onfirst = jest.fn(() => undefined)
    const onload = jest.fn(() => 99)

    ctx.use({
      id: 'xxxxx',
      onfirst,
      onload
    })

    // @ts-ignore
    await ctx.loadOne('xxxxx')
    // @ts-ignore
    await ctx.loadOne('xxxxx')
    // @ts-ignore
    await ctx.loadOne('xxxxx')
    // @ts-ignore
    await ctx.loadOne('xxxxx')

    // @ts-ignore
    expect(ctx._didonfirstmap.has('xxxxx')).toBe(true)
    expect(onfirst).toBeCalled()
    expect(onfirst).toBeCalledWith(ctx)
    expect(onfirst.mock.calls.length).toBe(1)

    expect(onload).toBeCalled()
    expect(onload).toBeCalledWith(ctx)
    expect(onload.mock.calls.length).toBe(4)
  })

  test('should call onbefore', async () => {
    const ctx = new Context()
    const onready_x = jest.fn(() => 99)
    const onready_y = jest.fn(() => 99)
    const onready_z = jest.fn(() => 99)

    const onfirst_x = jest.fn(() => 99)
    const onfirst_y = jest.fn(() => 99)
    const onfirst_z = jest.fn(() => 99)

    const onload_x = jest.fn(() => 99)
    const onload_y = jest.fn(() => 99)
    const onload_z = jest.fn(() => 99)

    const onbefore_x = jest.fn((ctx, next) => next())
    const onbefore_y = jest.fn((ctx, next) => next())
    const onbefore_z = jest.fn((ctx, next) => next())

    ctx
      .use({
        id: 'x',
        onfirst: onfirst_x,
        onload: onload_x,
        onbefore: onbefore_x,
        onready: onready_x,
        dependencies: ['y']
      })
      .use({
        id: 'y',
        onfirst: onfirst_y,
        onload: onload_y,
        onready: onready_y,
        onbefore: onbefore_y,
        dependencies: ['z']
      })
      .use(
        Promise.resolve({
          id: 'z',
          onfirst: onfirst_z,
          onload: onload_z,
          onready: onready_z,
          onbefore: onbefore_z
        })
      )

    const callback = jest.fn(() => {})
    await ctx.callback(callback)

    expect(callback).toBeCalled()
    expect(callback).toBeCalledWith(ctx)

    expect(onready_x).toBeCalled()
    expect(onready_y).toBeCalled()
    expect(onready_z).toBeCalled()

    // @ts-ignore
    const depts = ctx.getPluginsWithDepts('x')
    expect(depts.map(d => d.id)).toEqual(['z', 'y', 'x'])

    // @ts-ignore
    await ctx.runOnBefores('x')

    expect(onbefore_z).toBeCalled()
    expect(onbefore_y).toBeCalled()
    expect(onbefore_x).toBeCalled()

    // @ts-ignore
    await ctx.runOnBefores('z')
    expect(onbefore_z).toBeCalled()
  })

  test('should call onafter', async () => {
    const ctx = new Context()
    const onready_x = jest.fn(() => 99)
    const onready_y = jest.fn(() => 99)
    const onready_z = jest.fn(() => 99)

    const onfirst_x = jest.fn(() => 99)
    const onfirst_y = jest.fn(() => 99)
    const onfirst_z = jest.fn(() => 99)

    const onload_x = jest.fn(() => 99)
    const onload_y = jest.fn(() => 99)
    const onload_z = jest.fn(() => 99)

    const onafter_x = jest.fn(() => 99)
    const onafter_y = jest.fn(() => 99)
    const onafter_z = jest.fn(() => 99)

    const onbefore_x = jest.fn((ctx, next) => next())
    const onbefore_y = jest.fn((ctx, next) => next())
    const onbefore_z = jest.fn((ctx, next) => next())

    ctx
      .use({
        id: 'x',
        onfirst: onfirst_x,
        onload: onload_x,
        onbefore: onbefore_x,
        onready: onready_x,
        onafter: onafter_x,
        dependencies: ['y']
      })
      .use({
        id: 'y',
        onfirst: onfirst_y,
        onload: onload_y,
        onready: onready_y,
        onbefore: onbefore_y,
        onafter: onafter_y,
        dependencies: ['z']
      })
      .use(
        Promise.resolve({
          id: 'z',
          onfirst: onfirst_z,
          onload: onload_z,
          onready: onready_z,
          onbefore: onbefore_z,
          onafter: onafter_z
        })
      )

    let kk = 9

    const callback = jest.fn(async () => {
      await new Promise(resolve => setTimeout(() => resolve(3000), 3000))
      kk = 13
    })
    await ctx.callback(callback)
    expect(kk).toEqual(13)

    expect(callback).toBeCalled()
    expect(callback).toBeCalledWith(ctx)

    expect(onready_x).toBeCalled()
    expect(onready_y).toBeCalled()
    expect(onready_z).toBeCalled()

    await new Promise(resolve => setTimeout(resolve, 1000))

    expect(onafter_x).toBeCalled()
    expect(onafter_y).toBeCalled()
    expect(onafter_z).toBeCalled()

    // @ts-ignore
    const depts = ctx.getPluginsWithDepts('x')
    expect(depts.map(d => d.id)).toEqual(['z', 'y', 'x'])

    // @ts-ignore
    await ctx.runOnBefores('x')

    expect(onbefore_z).toBeCalled()
    expect(onbefore_y).toBeCalled()
    expect(onbefore_x).toBeCalled()

    // @ts-ignore
    await ctx.runOnBefores('z')
    expect(onbefore_z).toBeCalled()
  })
})

describe('Context API', () => {
  describe.each(['sync', 'dynamic'])('.use(%s)', type => {
    let ctx: Context
    let xxx: number
    let yyy: number

    if (type === 'sync') {
      beforeEach(() => {
        xxx = 0
        yyy = 0
        ctx = new Context()

        ctx.use({
          id: 'p0',
          onload() {
            return { a: 0 }
          },
          onready() {
            xxx++
          }
        })
        ctx.use({
          id: 'p1',
          onload() {
            return { b: 0 }
          },
          dependencies: ['p0'],
          onready() {
            xxx++
          },
          services: {
            getInfo(aaa: number) {
              return aaa + 999
            }
          }
        })
        ctx.use({
          id: 'p2',
          onload() {
            return { c: 0 }
          },
          dependencies: ['p0'],
          onready() {
            xxx++
          }
        })
        ctx.use({
          id: 'p3',
          onload() {
            return { d: 0 }
          },
          dependencies: ['p0'],
          onfirst() {
            yyy++
          },
          onready() {
            xxx++
          }
        })
        ctx.use({
          id: 'p4',
          onload() {
            return { e: 0 }
          },
          dependencies: ['p0', 'p1'],
          onready() {
            xxx++
          }
        })
        ctx.use({
          id: 'p5',
          onload() {
            return { f: 0 }
          },
          dependencies: ['p0', 'p4'],
          onready() {
            xxx++
          }
        })

        ctx.callback(() => {})
      })
    }

    if (type === 'dynamic') {
      beforeEach(() => {
        xxx = 0
        yyy = 0
        ctx = new Context()

        ctx.use(
          Promise.resolve({
            id: 'p0',
            onload() {
              return { a: 0 }
            },
            onready() {
              xxx++
            }
          })
        )

        ctx.use(
          Promise.resolve({
            id: 'p1',
            onload() {
              return { b: 0 }
            },
            dependencies: ['p0'],
            onready() {
              xxx++
            },
            services: () =>
              Promise.resolve({
                getInfo(aaa: number) {
                  return aaa + 999
                }
              })
          })
        )

        ctx.use(
          Promise.resolve({
            id: 'p2',
            onload() {
              return { c: 0 }
            },
            dependencies: ['p0'],
            onready() {
              xxx++
            }
          })
        )

        ctx.use(
          Promise.resolve({
            id: 'p3',
            onload() {
              return { d: 0 }
            },
            dependencies: ['p0'],
            onfirst() {
              yyy++
            },
            onready() {
              xxx++
            }
          })
        )

        ctx.use(
          Promise.resolve({
            id: 'p4',
            onload() {
              return { e: 0 }
            },
            dependencies: ['p0', 'p1'],
            onready() {
              xxx++
            }
          })
        )

        ctx.use(
          Promise.resolve({
            id: 'p5',
            onload() {
              return { f: 0 }
            },
            dependencies: ['p0', 'p4'],
            onready() {
              xxx++
            }
          })
        )

        ctx.callback(() => {})
      })
    }

    test('should load without depts', async () => {
      // @ts-ignore
      const apps = await ctx.loadWithDepts('p0')

      expect(apps.length).toBe(1)

      const app0 = apps[0]

      expect(app0.id).toBe('p0')
      expect(app0.value).toEqual({ a: 0 })
    })

    test('should load with depts', async () => {
      // @ts-ignore
      const apps = await ctx.loadWithDepts('p1')

      expect(apps.length).toBe(2)

      const app0 = apps[0]

      expect(app0.id).toBe('p0')
      expect(app0.value).toEqual({ a: 0 })

      const app1 = apps[1]

      expect(app1.id).toBe('p1')
      expect(app1.value).toEqual({ b: 0 })
    })

    test('should load with depts :: 1', async () => {
      // @ts-ignore
      const apps = await ctx.loadWithDepts('p5')

      expect(apps.length).toBe(4)
      expect(apps.map(n => n.id)).toEqual(['p0', 'p1', 'p4', 'p5'])

      const app0 = apps[0]
      expect(app0.id).toBe('p0')
      expect(app0.value).toEqual({ a: 0 })

      const app1 = apps[1]
      expect(app1.id).toBe('p1')
      expect(app1.value).toEqual({ b: 0 })

      const app2 = apps[2]
      expect(app2.id).toBe('p4')
      expect(app2.value).toEqual({ e: 0 })

      const app3 = apps[3]
      expect(app3.id).toBe('p5')
      expect(app3.value).toEqual({ f: 0 })
    })

    test('should load with onfirst', async () => {
      // @ts-ignore
      await ctx.loadWithDepts('p5')
      expect(yyy).toBe(0)
      // @ts-ignore
      await ctx.loadWithDepts('p3')
      expect(yyy).toBe(1)
      // @ts-ignore
      await ctx.loadWithDepts('p3')
      expect(yyy).toBe(1)
      // @ts-ignore
      await ctx.loadWithDepts('p3')
      expect(yyy).toBe(1)
    })

    test('should load with onready', async () => {
      // @ts-ignore
      await ctx.loadWithDepts('p5')
      expect(xxx).toBe(6)
      // @ts-ignore
      await ctx.loadWithDepts('p3')
      expect(xxx).toBe(6)
      // @ts-ignore
      await ctx.loadWithDepts('p3')
      expect(xxx).toBe(6)
      // @ts-ignore
      await ctx.loadWithDepts('p3')
      expect(xxx).toBe(6)
    })

    test('should apply service', async () => {
      const oo = await ctx.applyService('p1', 'getInfo', 444)
      expect(oo).toBe(1443)
    })

    test('should return dependencies', async () => {
      // @ts-ignore
      const depts = ctx.getPluginsWithDepts('p5')
      expect(depts.map(d => d.id)).toEqual(['p0', 'p1', 'p4', 'p5'])
    })
  })

  test('should call loadPoint', async () => {
    const ctx = new Context()

    ctx
      .use({
        point: 'x',
        onload: () => ({ x: 2 })
      })
      .use({
        point: 'x',
        onload: () => ({ y: 2 })
      })
      .use(
        Promise.resolve({
          point: 'x',
          onload: () => ({ z: 4 })
        })
      )

    await ctx.callback(async () => {})

    const x = await ctx.loadPoint(`x`)
    expect(x).toEqual([{ x: 2 }, { y: 2 }, { z: 4 }])
    const y = await ctx.loadPoint(`x`)
    expect(x).toEqual(y)
    const z = await ctx.reloadPoint(`x`)
    expect(z).toEqual(x)
    expect(z).not.toBe(x)
  })

  test('should call loadPoint with namespace', async () => {
    const ctx = new Context()

    ctx
      .use({
        point: 'x',
        namespace: '@3',
        onload: () => ({ x: 2 })
      })
      .use({
        point: 'x',

        onload: () => ({ y: 2 })
      })
      .use(
        Promise.resolve({
          point: 'x',
          namespace: '@3',
          onload: () => ({ z: 4 })
        })
      )

    await ctx.callback(async () => {})

    const x = await ctx.loadPoint(`x`)
    expect(x).toEqual([{ x: 2 }, { y: 2 }, { z: 4 }])
    const y = await ctx.loadPoint(`x`)
    expect(x).toEqual(y)
    const z = await ctx.reloadPoint(`x`)
    expect(z).toEqual(x)
    expect(z).not.toBe(x)

    const n = await ctx.loadPoint(`x`, '@3')
    expect(n).toEqual([{ x: 2 }, { z: 4 }])

    const d = await ctx.reloadPoint(`x`, '@3')
    expect(d).toEqual([{ x: 2 }, { z: 4 }])
  })

  test('should support dependencies not exist', async () => {
    let xxx = 0
    const ctx = new Context()

    ctx.use({
      id: 'p0',
      onload() {
        return { c: 0 }
      }
    })
    ctx.use({
      id: 'p1',
      onload() {
        return { b: 0 }
      },
      dependencies: ['p0'],
      onready() {
        xxx++
      },
      services: {
        getInfo(aaa: number) {
          return aaa + 999
        }
      }
    })
    ctx.use({
      id: 'p2',
      onload() {
        return { c: 0 }
      },
      dependencies: ['p0']
    })
    ctx.use({
      id: 'p3',
      onload() {
        return { d: 0 }
      },
      dependencies: ['p0']
    })
    ctx.use({
      id: 'p5',
      onload() {
        return { f: 0 }
      },
      dependencies: ['p0', 'p4'],
      onready() {
        xxx++
      }
    })

    await ctx.callback(() => {})

    try {
      // @ts-ignore
      const xx = await ctx.loadWithDepts('p5')
    } catch (e) {
      expect(e.message).toEqual('do not exist plugin<p4>')
    }
  })
})

describe('Hooks API', () => {
  test('should call hook-onload', async () => {
    const ctx = new Context()

    ctx
      .use({
        point: '@@layers',
        prefix: '@o01-----909080',
        onload: () => [{ key: 'aaaa', cc: 0 }]
      })
      .use({
        point: '@@layers',
        prefix: '@o02',
        onload: () => [{ key: 'bbbb', cc: 0 }]
      })
      .use(
        Promise.resolve({
          point: '@@layers',
          prefix: '@o03',
          onload: () => [{ key: 'cccc', cc: 0 }]
        })
      )

    ctx.hook('onload', (data: any) => {
      if (!data.prefix) {
        return data
      }
      data.value = data.value.map((line: any) => ({ ...line, key: `${data.prefix}:${line.key}` }))
      return data
    })

    await ctx.callback(async () => {})

    const x = await ctx.loadPoint(`@@layers`)

    expect(x).toEqual([[{ cc: 0, key: '@o01-----909080:aaaa' }], [{ cc: 0, key: '@o02:bbbb' }], [{ cc: 0, key: '@o03:cccc' }]])
  })

  test('should call hook-onuse-onfirst', async () => {
    const ctx = new Context()

    const fn = jest.fn((ctx, next) => {})

    ctx
      .use({
        id: '@000',
        onfirst: fn as any
      })

      .use({
        id: '@001',
        path: '/',
        onload: () => [{ key: 'aaaa', cc: 0 }]
      })

      .use({
        id: '@002',
        path: '/login',
        excludeMainDepts: true,
        onload: () => [{ key: 'bbbb', cc: 0 }]
      })
      .use(
        Promise.resolve({
          id: '@003',
          path: '/mine/about',
          excludeMainDepts: true,
          onload: () => [{ key: 'cccc', cc: 0 }]
        })
      )

    ctx.hook('onuse', (p: IPlugin) => {
      if (p.excludeMainDepts === true) {
        p.dependencies = []
      }

      if (p.path === '/') {
        p.dependencies = ['@000']
      }

      return p
    })

    await ctx.callback(async () => {})

    // @ts-ignore
    await ctx.loadOne(`@002`)
    expect(fn).not.toBeCalled()

    // @ts-ignore
    await ctx.loadOne(`@003`)
    expect(fn).not.toBeCalled()

    // @ts-ignore
    await ctx.loadOne(`@001`)
    expect(fn).toBeCalled()
  })

  test('should call hook-onuse-onbefore', async () => {
    const ctx = new Context()

    const fn = jest.fn((ctx, next) => next())

    ctx
      .use({
        id: '@000',
        onbefore: fn
      })

      .use({
        id: '@001',
        path: '/',
        onload: () => [{ key: 'aaaa', cc: 0 }]
      })

      .use({
        id: '@002',
        path: '/login',
        excludeMainDepts: true,
        onload: () => [{ key: 'bbbb', cc: 0 }]
      })

      .use(
        Promise.resolve({
          id: '@003',
          path: '/mine/about',
          excludeMainDepts: true,
          onload: () => [{ key: 'cccc', cc: 0 }]
        })
      )

    ctx.hook('onuse', (p: IPlugin) => {
      if (p.excludeMainDepts === true) {
        p.dependencies = []
      }

      if (p.path === '/') {
        p.dependencies = ['@000']
      }

      return p
    })

    await ctx.callback(async () => {})

    // @ts-ignore
    await ctx.loadOne(`@002`)
    expect(fn).not.toBeCalled()

    // @ts-ignore
    await ctx.loadOne(`@003`)
    expect(fn).not.toBeCalled()

    // @ts-ignore
    await ctx.loadOne(`@001`)
    expect(fn).toBeCalled()
  })
})

describe('onfirst only called once!', () => {
  test('multi loadOne and do not by await', async () => {
    const ctx = new Context()
    const onfirst = jest.fn(() => undefined)
    const onfirst2 = jest.fn(() => undefined)
    const onload = jest.fn(() => undefined)

    ctx
      .use({
        id: 'xxx',
        onfirst
      })
      .use({
        id: 'yyy',
        onload,
        onfirst: onfirst2,
        dependencies: ['xxx']
      })

    await ctx.callback(async () => {})

    // @ts-ignore
    ctx.loadOne('yyy')
    // @ts-ignore
    ctx.loadOne('yyy')
    // @ts-ignore
    await ctx.loadOne('yyy')

    // @ts-ignore
    expect(ctx._didonfirstmap.has('xxx')).toBe(true)
    // @ts-ignore
    expect(ctx._didonfirstmap.has('yyy')).toBe(true)

    expect(onload).toBeCalled()
    expect(onfirst).toBeCalled()
    expect(onfirst).toBeCalledWith(ctx)
    expect(onfirst.mock.calls.length).toBe(1)
    expect(onfirst2.mock.calls.length).toBe(1)
  })
})
