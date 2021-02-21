/**
 * **Created on 19/02/2021**
 *
 * src/index.js
 * @author André Timermann <andre@timermann.com.br>
 *
 *   Entry Point do modulo no Nuxt
 *
 */
'use strict'

import path from 'path'

export default function NuxtSModelModule(optionsModule) {
  this.addPlugin(
    {
      src: path.resolve(__dirname, '..', 'src', 'plugin.js'),
      options: {
        importPath: optionsModule.importPath || '~/models/${modelName}.model.js'
      }
    }
  )

}

// OBRIGATÓRIO se publicar o módulo como pacote npm
module.exports.meta = require('../package.json')
