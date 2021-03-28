/**
 * **Created on 23/03/2021**
 *
 * src/types/array.type.js
 * @author André Timermann <andre@timermann.com.br>
 *
 *   Gerencia arrays (tipos terminados com [])
 *
 */

'use strict'

import Model from '../model'
import ModelType from '../model-type'

export default class Array extends ModelType {

  static setup (instance, attrName, attrType) {

    Object.defineProperty(instance, attrName, {
      get () {
        return instance.__rawValues[attrName]
      },
      set (value) {
        instance.__rawValues[attrName] = Model.createCollectionAttributeValue(instance, attrType, attrName, value)
      }
    })

  }
}
