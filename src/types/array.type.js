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
        const arr = instance.__rawValues[attrName]

        arr.mpush = function (value) {
          arr.push(Model.createAttributeValue(instance, attrType.substr(0, attrType.length - 2), attrName, value))
        }

        // TODO: Atualmente necessário utilizar mpush, mas alterar o proprio push para converter submodels
        // arr.push = function (obj) {
        //   var push = Array.prototype.push.apply(arr, arguments)
        //
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](obj, 'push')
        //   }
        //   return push
        // }
        //
        // arr.pop = function () {
        //   var popped = Array.prototype.pop.apply(arr, arguments)
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](popped, 'pop')
        //   }
        //   return popped
        // }
        //
        // arr.reverse = function () {
        //   var result = Array.prototype.reverse.apply(arr, arguments)
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](result, 'reverse')
        //   }
        //   return result
        // }
        //
        // arr.shift = function () {
        //   var deleted_item = Array.prototype.shift.apply(arr, arguments)
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](deleted_item, 'shift')
        //   }
        //   return deleted_item
        // }
        //
        // arr.sort = function () {
        //   var result = Array.prototype.sort.apply(arr, arguments)
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](result, 'sort')
        //   }
        //   return result
        // }
        //
        // arr.splice = function (i, length, itemsToInsert) {
        //   var returnObj
        //   if (itemsToInsert) {
        //     Array.prototype.slice.call(arguments, 2)
        //     returnObj = itemsToInsert
        //   } else {
        //     returnObj = Array.prototype.splice.apply(arr, arguments)
        //   }
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](returnObj, 'splice')
        //   }
        //   return returnObj
        // }
        //
        // arr.unshift = function () {
        //   var new_length = Array.prototype.unshift.apply(arr, arguments)
        //   for (var i = 0; i < _this.observers.length; i++) {
        //     _this.observers[i](new_length, 'unshift')
        //   }
        //   return arguments
        // }

        return arr
      },
      set (value) {
        instance.__rawValues[attrName] = Model.createCollectionAttributeValue(instance, attrType, attrName, value)
      }
    })

  }
}
