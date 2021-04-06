/***************************************************
 * Created by nanyuantingfeng on 2020/2/17 19:00. *
 ***************************************************/
import { useEffect, useRef, useState } from 'react'
import { Deffer } from './helpers'
import { Container, ContainerInstance } from 'typedi'
import MessageCenter from '@ekuaibao/messagecenter'

export function useWatchSystemMessage<I, O>(messageId: string, initData?: I): [boolean, I, (data: O) => void] {
  const ref = useRef(Deffer())
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState(initData)

  useEffect(() => {
    const container = Container.get<ContainerInstance>('@@container')
    const bus = container.get<MessageCenter>('@@bus')
    bus.un(messageId).watch(messageId, data => {
      setData(data)
      setVisible(true)
      return ref.current.promise
    })

    return () => bus.un(messageId)
  }, [])

  const setResult = (data: O) => {
    ref.current.resolve(data)
    setVisible(false)
    ref.current = Deffer()
  }

  return [visible, data, setResult]
}
