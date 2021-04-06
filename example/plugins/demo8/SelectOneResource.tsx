/***************************************************
 * Created by nanyuantingfeng on 2020/2/17 15:11. *
 ***************************************************/
import React, { useRef } from 'react'
import '@ekuaibao/react-modal/style/index.css'
import { Modal } from '@ekuaibao/react-modal'
import { useWatchSystemMessage } from './useWatchSystemMessage'

export const SelectOneResource: React.FunctionComponent<{}> = function() {
  const [visible, list, setResult] = useWatchSystemMessage<object[], object>('@@system:SelectOneResource', [])

  return (
    <Modal visible={visible} onClose={() => setResult(null)} animation="slideUp">
      <div className="header">Modal</div>
      <div className="body">
        <ul>
          {list.map((line: any, index) => (
            <li key={String(index)}>
              <input type="radio" name="K" id={String(index)} value={index} />
              <label htmlFor={String(index)}> {JSON.stringify(line)}</label>
            </li>
          ))}
        </ul>
        <button onClick={() => setResult(list[0])}>OK(0)</button>
        <button onClick={() => setResult(list[1])}>OK(1)</button>
      </div>
    </Modal>
  )
}

export default SelectOneResource
