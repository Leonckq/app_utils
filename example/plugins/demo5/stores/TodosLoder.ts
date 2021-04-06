/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-29 18:11
 */

import { Snapshot } from '@ekuaibao/mmlpx'

export default class TodosLoder {
  static readonly snapshotKey = 'mobx-mmlpx-snapshot'

  static saveSnapshot(snapshot: Snapshot) {
    localStorage.setItem(TodosLoder.snapshotKey, JSON.stringify(snapshot))
  }

  static getSnapshot(): Snapshot {
    return JSON.parse(localStorage.getItem(TodosLoder.snapshotKey)!)
  }
}
