/**
 * **Created on 23/03/2021**
 *
 * src/types/sub-model.type.js
 * @author André Timermann <andre@timermann.com.br>
 *
 */

'use strict'

import Model from '../model'
import ModelType from '../model-type'

export default class SubModelType extends ModelType {

  static setup (instance, attrName, attrType) {

    Object.defineProperty(instance, attrName, {
      get () {
        return instance.__rawValues[attrName]
      },
      set (value) {
        instance.__rawValues[attrName] = Model._createSubModelAttribute(instance, attrType, attrName, value)
        instance._callObservers(attrName, value)
      }
    })

  }
}
