/***************************************************
 * Created by nanyuantingfeng on 2020/2/17 18:07. *
 ***************************************************/
import React from 'react'
import '@ekuaibao/iframe-layer/style'
import { ModalIframe } from '@ekuaibao/iframe-layer'
import { useWatchSystemMessage } from './useWatchSystemMessage'

export const OpenResourceInModal: React.FunctionComponent<{}> = () => {
  const [visible, data, setResult] = useWatchSystemMessage<any, object>('@@system:OpenResourceInModal', {})

  return <ModalIframe url={data.source} visible={visible} onClose={() => setResult({ K: 34446666 })} />
}

export default OpenResourceInModal
