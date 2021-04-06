/***************************************************
 * Created by nanyuantingfeng on 2020/2/17 18:33. *
 ***************************************************/
export function Deffer<T>() {
  let re: (value?: T | PromiseLike<T>) => void = null
  let rj: (reason?: any) => void = null
  let promise = new Promise<T>((resolve, reject) => {
    re = resolve
    rj = reject
  })

  return { resolve: re, reject: rj, promise }
}
