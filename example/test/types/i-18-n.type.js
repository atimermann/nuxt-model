/**
 * **Created on 23/03/2021**
 *
 * src/types/primitive.js
 * @author André Timermann <andre@timermann.com.br>
 *
 *   Dados primitivos: String, Number, Boolean
 *
 */

'use strict'

import { cloneDeep } from 'lodash'
import ModelType from '@agtm/nuxt-model/dist/model-type'

export default class I18nType extends ModelType {


  static setup (instance, attrName, attrType) {

    Object.defineProperty(instance, attrName, {
      get () {


        console.log('GETTER', instance.constructor.app)

        return 'Japão'
        // return instance.__rawValues[attrName]
      },
      set (value) {
        instance.__rawValues[attrName] = cloneDeep(value)
      }
    })
  }
}


