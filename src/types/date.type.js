/**
 * **Created on 23/03/2021**
 *
 * src/types/date.type.js
 * @author André Timermann <andre@timermann.com.br>
 *
 *   Implementa tipo Data, converte string para Date automaticamente
 *
 */

'use strict'

import ModelType from '../model-type'

export default class Date extends ModelType{

  static setup ( instance, attrName) {
    Object.defineProperty(instance, attrName, {
      get () {
        return instance.__rawValues[attrName]
      },
      set (value) {
        if (value instanceof Date) {
          instance.__rawValues[attrName] = value
        } else if (typeof (value) === 'string') {
          instance.__rawValues[attrName] = new Date(value)
        } else {
          throw new TypeError(`Attribute "${attrName}"(${value}) must be instance of Date or type "string", get "${typeof (value)}"`)
        }
      }
    })

  }

}
