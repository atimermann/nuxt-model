/**
 * **Created on 19/02/2021**
 *
 * src/index.js
 * @author André Timermann <andre@timermann.com.br>
 *
 *  Módulo para ser carregado no Nuxt
 *
 */
'use strict'

import path from 'path'
import { defaults } from 'lodash'

export default function NuxtModelModule (optionsModule) {
  this.addPlugin(
    {
      src: path.resolve(__dirname, '..', 'dist', 'plugin.js.tpl'),
      options: defaults(
        optionsModule,
        {
          importPath: '~/models/${modelName}.model.js',
          typeImportPath: '~/types/${typeName}.type.js',
          enableConstructorName: true,
          fileCaseStyle: 'kebabCase',
          typeValidation: ''
          // Novos atributos devem ser configurados aqui, em plugins.js.tpl e no contrutor do model.js
        }
      )
    }
  )

}

// OBRIGATÓRIO se publicar o módulo como pacote npm
module.exports.meta = require('../package.json')
