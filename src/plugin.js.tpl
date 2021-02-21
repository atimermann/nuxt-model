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

import Model from '@atimermann/nuxt-model'

export default (context) => {

  const loadModelModuleFunction = async function (modelName) {
    const Module = await import(`<%= options.importPath %>`)
    if (Module) {
      return Module.default
    }
  }

  Model.configure({
    context,
    loadModelModuleFunction,
    enableConstructorName: <%= options.enableConstructorName %>,
    fileCaseStyle: '<%= options.fileCaseStyle %>'
  })
}
