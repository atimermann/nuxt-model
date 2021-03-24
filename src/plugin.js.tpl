/**
 * **Created on 19/02/2021**
 *
 * src/plugin.js
 * @author André Timermann <andre@timermann.com.br>
 *
 * Nota: Este arquivo está no formato lodash template
 * REF:  https://lodash.com/docs/4.17.15#template
 */
'use strict'

import Model from '@agtm/nuxt-model'

export default (context) => {
  const loadModelModuleFunction = function (modelName) {
    const Module = require(`<%= options.importPath %>`)
    if (Module) {
      return Module.default
    }
  }

  const loadTypeModuleFunction = function (typeName) {
    const Module = require(`<%= options.typeImportPath %>`)
    if (Module) {
      return Module.default
    }
  }

  Model.configure({
    context,
    loadModelModuleFunction,
    loadTypeModuleFunction,
    enableConstructorName: <%= options.enableConstructorName %>,
    fileCaseStyle: '<%= options.fileCaseStyle %>'
  })
}
