/**************************************************
 * Created by nanyuantingfeng on 2018/8/11 11:10.
 **************************************************/
import { Store, inject } from '@ekuaibao/mmlpx'
import TodosStore from '../demo5/stores/TodosStore'

class VStoreR {
  @inject(TodosStore, 'VStore')
  todostore: any
}

const VStore = Store('VStore')(VStoreR)

export default VStore
