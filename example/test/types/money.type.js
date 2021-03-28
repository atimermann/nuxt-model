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
import { ModelType } from '@agtm/nuxt-model'

export default class MoneyType extends ModelType {

  static setup (instance, attrName, attrType) {

    Object.defineProperty(instance, attrName, {
      get () {

        if (instance.__rawValues[attrName] !== undefined){
          return 'R$ ' + instance.__rawValues[attrName].toFixed(2)
        }

        // return instance.__rawValues[attrName]
      },
      set (value) {

        instance.__rawValues[attrName] = cloneDeep(value)
      }
    })
  }
}


