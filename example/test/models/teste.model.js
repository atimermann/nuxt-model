/**
 * **Created on 19/02/2021**
 *
 * <File Reference Aqui: test.model.js>
 * @author André Timermann <andre@timermann.com.br>
 *
 */

'use strict'

import { Model } from '@agtm/nuxt-model'

export default class TesteModel extends Model {
  static nameType = { type: 'SubTesteModel' }
  static idType = { type: 'number' }
  static nascimentoType = 'date'
  static profissaoType = 'string'
  static paisType = 'i18n'
  static valorType = { type: 'money' }

  // id = 123
  // profissao = 'Desenvolvedor'
  // pais = 'Brazil'

  get isStatic () {
    return Model.context.isStatic + this.id
  }
}
