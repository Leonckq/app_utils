/***************************************************
 * Created by nanyuantingfeng on 2019/11/11 16:03. *
 ***************************************************/
import { Container } from 'typedi'

// 全局命名空间
const container = Container.of('@@system')

Container.set('@@container', container)

export { container }

export default container
