/**
 * **Created on 19/02/2021**
 *
 * <File Reference Aqui: test.model.js>
 * @author André Timermann <andre@timermann.com.br>
 *
 */

'use strict'

import { Model } from '@agtm/nuxt-model'

export default class SubTesteModel extends Model {
  static nameType = 'TesteModel[]'
  static idType = 'number'

  /**
   * @type {number}
   */
  id

  get isStatic () {
    return Model.context.isStatic + this.id
  }
}
