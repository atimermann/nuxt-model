/**
 * **Created on 19/02/2021**
 *
 * <File Reference Aqui: test.model.js>
 * @author André Timermann <andre@timermann.com.br>
 *
 */

'use strict'

import Model from '@atimermann/nuxt-model'

export default class TesteModel extends Model {
  static nameType = 'SubTesteModel'
  static idType = 'number'
  static nascimentoType = 'date'
  static profissaoType = 'string'

  id = 123
  profissao = 'Desenvolvedor'

  get isStatic () {
    return Model.context.isStatic + this.id
  }
}
