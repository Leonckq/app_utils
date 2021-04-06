/***************************************************
 * Created by nanyuantingfeng on 2020/2/6 15:17. *
 ***************************************************/
import { IThirdResource, IThirdResourceRequestType } from './types'
import MessageCenter from '@ekuaibao/messagecenter'

function uniq<T extends { id: any }>(data: T[]): T[] {
  const hash = new Set()
  return data.reduce((oo, value) => {
    if (!hash.has(value.id)) {
      hash.add(value.id)
      oo.push(value)
    }
    return oo
  }, [] as T[])
}

export default class ThirdResourcesManager {
  constructor(private bus: MessageCenter) {}

  private resources: IThirdResource[] = []

  add(resources: IThirdResource | IThirdResource[]) {
    if (!resources) return this
    this.resources = uniq<IThirdResource>(this.resources.concat(resources))
    return this
  }

  get(type: string) {
    return this.resources.filter(s => s.type === type).sort((a, b) => (a.weight > b.weight ? 1 : -1))
  }

  deleteById(...ids: string[]) {
    this.resources = this.resources.filter(s => !ids.includes(s.id))
  }

  deleteByType(...types: string[]) {
    this.resources = this.resources.filter(s => !types.includes(s.type))
  }

  async request<T>(type: IThirdResourceRequestType | string, ...data: any[]): Promise<T> {
    if (typeof type === 'string') {
      type = { type }
    }

    try {
      const resource = await this.getOneResource(type)
      resource.services = { ...resource.services, ...type.services }
      return this.bus.invoke<T>('@@system:OpenResourceInModal', resource, ...data)
    } catch (e) {
      console.warn(e)
      return Promise.reject(e)
    }
  }

  private async getOneResource(type: IThirdResourceRequestType): Promise<IThirdResource> {
    if (type.id) {
      const oo = this.resources.filter(service => service.id === type.id)

      if (!oo || !oo.length) {
        return Promise.reject({ code: 0, message: `没有发现id:${type.id}的第三方注册` })
      }

      return oo[0]
    }

    const resources = this.get(type.type)

    if (!resources.length) {
      return Promise.reject({ code: 0, message: `没有发现type:${type.type}的第三方注册` })
    }

    if (resources.length === 1 || !!type.silent) {
      return resources[0]
    }

    const resource = await this.bus.invoke<IThirdResource>('@@system:SelectOneResource', resources)

    if (!resource) {
      return Promise.reject({ code: 1, message: `当前选择已被取消` })
    }

    return resource
  }
}
