/**
 * **Created on 19/02/2021**
 *
 * <File Reference Aqui: teste.model.js>
 * @author André Timermann <andre@timermann.com.br>
 *
 */

'use strict'

import Model from '@atimermann/smodel'
import TesteModel from '~/models/teste.model'

export default class SubTesteModel extends Model {
  static __class = 'SubTesteModel'
  static nameType = TesteModel

  /**
   * @type {SubTesteModel}
   */
  teste
}
