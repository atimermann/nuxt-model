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
import ModelType from '../model-type'

export default class PrimitiveType extends ModelType {


  static setup (instance, attrName, attrType) {
    Object.defineProperty(instance, attrName, {
      get () {
        return instance.__rawValues[attrName]
      },
      set (value) {

        if (typeof (value) !== attrType) {
          throw new TypeError(`Attribute "${attrName}"(${value}) must be of type "${attrType}", get "${typeof (value)}"`)
        }

        instance.__rawValues[attrName] = cloneDeep(value)
      }
    })
  }
}


