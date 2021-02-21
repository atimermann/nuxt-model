/**
 * **Created on 19/02/2021**
 *
 * src/plugin.js
 * @author André Timermann <andre@timermann.com.br>
 *
 */
'use strict'

import Model from '@atimermann/smodel'

export default (context) => {

  const loadModelModuleFunction = async function (modelName) {
    const Module = await import(`<%= options.importPath %>`)
    if (Module) {
      return Module.default
    }
  }

  Model.configure({
    context,
    loadModelModuleFunction
  })
}
