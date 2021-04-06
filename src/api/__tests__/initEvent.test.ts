/******************************************************
 * Created by nanyuantingfeng on 2018/7/20 17:10.
 *****************************************************/
import initEvent from '../initEvent'

describe('Event', () => {
  describe('new Event()', () => {
    it('should create a `Event` instance', () => {
      const e = initEvent('cat')

      expect(e.type).toEqual('cat')
      expect(e.bubbles).toBe(false)
      expect(e.cancelable).toBe(false)
      expect(e.detail).toBe(null)
    })

    it('should create a `Event` instance with a `details` object', () => {
      const e = initEvent('meow', { detail: { foo: 'bar' } })

      expect(e.type).toEqual('meow')
      expect(e.bubbles).toEqual(false)
      expect(e.cancelable).toEqual(false)
      expect(e.detail.foo).toEqual('bar')
    })

    it('should create a `Event` instance with a `bubbles` boolean', () => {
      const e = initEvent('purr', { bubbles: true })

      expect(e.type).toEqual('purr')
      expect(e.bubbles).toEqual(true)
      expect(e.cancelable).toEqual(false)
      expect(e.detail).toBeNull()
    })

    it('should create a `Event` instance with a `cancelable` boolean', () => {
      const e = initEvent('scratch', { cancelable: true })

      expect(e.type).toEqual('scratch')
      expect(e.bubbles).toBe(false)
      expect(e.cancelable).toBe(true)
      expect(e.detail).toBe(null)
    })

    it('should create a `Event` instance that is dispatchable', done => {
      const e: any = initEvent('claw', {
        bubbles: true,
        cancelable: true,
        detail: { canhaz: 'cheeseburger' }
      })

      function onclaw(ev: any) {
        if (!ev) {
          ev = window.event
        }

        expect(e.bubbles).toEqual(true)
        expect(e.cancelable).toEqual(true)
        expect(e.detail.canhaz).toEqual('cheeseburger')
        done()
      }

      if (document.body.dispatchEvent) {
        document.body.addEventListener('claw', onclaw, false)
        document.body.dispatchEvent(e)
      } else {
        // IE <= 8 will only allow us to fire "known" event names,
        // so we need to fire "click" instead of "claw :\
        // @ts-ignore
        document.body.attachEvent('onclick', onclaw)

        // need to fire event in a separate tick for some reason…
        setTimeout(() => {
          e.type = 'click'
          e.eventName = 'click'
          e.eventType = 'click'

          // @ts-ignore
          document.body.fireEvent('onclick', e)
        }, 50)
      }
    })
  })
})
