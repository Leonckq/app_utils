/***************************************************
 * Created by nanyuantingfeng on 2020/2/6 15:18. *
 ***************************************************/
export interface IThirdResource {
  id: string  //唯一标识

  title?: string
  description?: string
  weight?: number //优先级, 为了配合 `silent/order` 设计

  type: string //类型标记
  source: string //源地址, (*.html OR *.js)
  sourceType: IThirdThirdResourceType

  // SCRIPT => WEB WORKER
  // FUNCTION => MAIN CONTENT
  // COMPONENT => MAIN CONTENT
  // HTML => IFRAME

  services?: Record<string, (...args: any[]) => Promise<any>>
}

export enum IThirdThirdResourceType {
  IFRAME = 'IFRAME',
  REMOTE_COMPONENT = 'REMOTE_COMPONENT',
  LOCAL_COMPONENT = 'LOCAL_COMPONENT',
  WINDOW_OPEN = 'WINDOW_OPEN',
  OPEN_LINK = 'OPEN_LINK'
}

export type IThirdResourceRequestType = {
  type: string
  silent?: boolean
  id?: string
  services?: Record<string, (...args: any[]) => Promise<any>>
}
