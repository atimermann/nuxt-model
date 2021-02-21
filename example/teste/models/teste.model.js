/**
 * **Created on 19/02/2021**
 *
 * <File Reference Aqui: teste.model.js>
 * @author André Timermann <andre@timermann.com.br>
 *
 */

'use strict'

import Model from '@atimermann/smodel'
import SubTesteModel from '~/models/sub-teste.model'

export default class TesteModel extends Model {
  static __class = 'TesteModel'
  static nameType = SubTesteModel

  id = '123'

  get isStatic () {
    return Model.context.isStatic + this.id
  }
}
