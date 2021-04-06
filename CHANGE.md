
# 5.1.1-beta-170
 * 增加命名空间

# 5.1.0-beta-170
 * 默认增加了prefix修正
 
 ```
 // API 提供.修正@@layers的prefix 策略
 app.hook('onload', data => {
   if (data.prefix && data.point) {
     data.value = data.value.map((line: any) => ({ ...line, key: `${data.prefix}:${line.key}` }))
   }
   return data
 })
 ```
 * 重新将MessageCenter从父类移除,成为成员属性


# 5.1.0-beta-160
 * 增加 hook onuse 的支持
 * 修正了onRunBrefore的执行位置


# 5.1.0-beta-150
 * 删除了 没有意义的 hook 支持
 * 增加了 useHistoryType 添加参数
 * 增加了 onafter 的执行位置修正
 * 增加了 Router 的调试名称


# 5.1.0-beta.40
 * 增加了`onload`缓存策略
 * 重新实现了 `hook` 系统
 * 增加了 `shcema::store`, 用于支持 `mobx-store`的定义在 `onfirst` 生命周期中(使用`hook`实现)

# 5.1.0-beta.20
 * 修正了 `onafter`的触发时机, 在页面渲染之后触发.


# 5.1.0-beta.0
  * 更新了 `history` 的获取方式, 增加了 `memory` 类型


