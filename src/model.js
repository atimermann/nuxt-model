/**
 * Created on 17/02/2021
 *
 * src/model.ts
 * @author Cheap2Ship
 *
 */

import { cloneDeep, camelCase, isPlainObject, kebabCase, snakeCase } from 'lodash'

export default class Model {
  /**
   * Nome desta classe, usada quando enableConstructorName for falso
   *
   * @type {string}
   */
  static className = '__BASE__'

  /**
   * Usado para identificar que a classe é uma subclase de Model (nunca deve ser alterada nas subclasses)
   * @type {boolean}
   */
  static _modelClass = true

  /**
   * Objeto de contexto do Nuxt
   * @type {Vue}
   */
  static context = null

  /**
   * Configurção da classe, usado na inicialização do nuxt
   * @param options
   */
  static configure (options) {
    Model.context = options.context
    Model.loadModelModule = options.loadModelModuleFunction
    Model.enableConstructorName = options.enableConstructorName
    Model.fileCaseStyle = options.fileCaseStyle
  }

  /**
   * Factory para criar nova instancia de um Model.
   * Deve ser inicializado por um JSON de dados
   *
   * @param {object} data  Dados no formato Json para ser povoar a instancaia
   *
   * @return {Promise<Model>}
   */
  static async create (data) {
    if (!data) {
      throw new Error('Data cannot be null or undefined when creating a model.')
    }

    if (Array.isArray(data)) {
      throw new TypeError('Array is not allowed. To create collections use createCollection.')
    }

    if (!isPlainObject(data)) {
      throw new TypeError(`Date attribute must be a plain object. ("${JSON.stringify(data)}")`)
    }

    const Class = this
    const instance = new Class()

    for (const [attrName, value] of Object.entries(data)) {

      if (attrName.substr(0, 1) === '_') {
        continue
      }

      const attrType = this[`${attrName}Type`]

      if (!attrType) {
        throw new Error(`There is no attribute "${attrName}" in class "${this.getClassName()}"`)
      }

      // TODO: Verificar outros tipos como Date
      if (attrType.substr(-2) === '[]') {
        await this._createCollectionAttribute(instance, attrType, attrName, value)
      } else if (attrType.substr(-5) === 'Model') {
        const subClassInstance = await this._createSubModelAttribute(instance, attrType, attrName, value)
        Object.defineProperty(instance, attrName, {
          enumerable: true,
          configurable: false,
          writable: false,
          value: subClassInstance
        })
      } else if (['boolean', 'number', 'string'].includes(attrType)) {
        Object.defineProperty(instance, attrName, {
          enumerable: true,
          configurable: false,
          writable: true,
          value: this._validateAndGetValue(attrType, attrName, value)
        })
      } else {
        throw new Error(`Type "${attrType}" defined in class "${this.getClassName()}" is invalid. Must be a subclass of Model name or primitive types such as boolean, string or numbers.`)
      }
    }

    return instance
  }

  /**
   * Cria uma coleção de models
   *
   * @param {object[]} collectionData
   * @return {Promise<[]>}
   */
  static async createCollection (collectionData) {
    const collection = []
    const Class = this

    if (!Array.isArray(collectionData)) {
      throw new Error(`CollectionData in "${this.getClassName()}" must be an Array. got "${collectionData}"`)
    }

    for (const data of collectionData) {
      collection.push(await Class.create(data))
    }

    return collection
  }

  /**
   * Retorna Nome da Classe
   *
   * @return {string}
   */
  static getClassName () {
    return Model.enableConstructorName
      ? this.name
      : this.className
  }

  /**
   * Retorna Objeto JSON deste model
   *
   * @return {{}}
   */
  toJSON () {
    const result = {}
    for (const attrName of Object.getOwnPropertyNames(this)) {
      if (attrName.substr(0, 1) !== '_') {
        const attrDescriptor = Object.getOwnPropertyDescriptor(this, attrName)

        // Atributo é outro model
        if (attrDescriptor.value.constructor._modelClass) {
          result[attrName] = attrDescriptor.value.toJSON()
        } else {
          result[attrName] = attrDescriptor.value
        }
      }
    }

    // Getters
    for (const attrName of Object.getOwnPropertyNames(this.constructor.prototype)) {
      if (attrName !== 'constructor') {
        result[attrName] = this[attrName]
      }
    }

    return result
  }

  /**
   * Retorna representação em String deste Model
   *
   * @return {string}
   */
  toString () {
    return JSON.stringify(this.toJSON())
  }

  /**
   * Valida o tipo do valor e retorna clone dele
   *
   * @param {String} attrType
   * @param {String} attrName
   * @param  value
   *
   * @private
   */
  static _validateAndGetValue (attrType, attrName, value) {
    // eslint-disable-next-line valid-typeof
    if (typeof (value) !== attrType) {
      throw new TypeError(`
      Attribute
      '${attrName}'(${value})
      must
      be
      of
      type
      '${attrType}', get
      '${typeof (value)}'`)
    }
    return cloneDeep(value)
  }

  /**
   * Atribui a instancia do model outro model (SubModel)
   *
   * @param {Model} instance    Instancia do Modelo
   * @param {String} attrType   Tipo de atributo
   * @param {String} attrName   Nome do atributo
   * @param {[]}value           Valor a ser atribuindo na instancia
   *
   * @return {Promise<void>}
   * @private
   */
  static async _createSubModelAttribute (instance, attrType, attrName, value) {
    const Class = await Model.loadModelModule(this._getClassFileName(attrType))
    const subClassInstance = await Class.create(value)

    // Vincula com pai
    Object.defineProperty(subClassInstance, '__parent', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: instance
    })

    return subClassInstance
  }

  /**
   * Adiciona um atributo do tipo coleção a uma instancia do modelo
   *
   * @param instance
   * @param attrType
   * @param attrName
   * @param values
   * @return {Promise<void>}
   * @private
   */
  static async _createCollectionAttribute (instance, attrType, attrName, values) {
    // remove []
    attrType = attrType.substr(0, attrType.length - 2)

    if (!Array.isArray(values)) {
      throw new TypeError(`
      Attribute
      '${attrName}' in class
      '${this.getClassName()}'
      must
      be
      an
      array.`)
    }

    Object.defineProperty(instance, attrName, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: []
    })

    for (const value of values) {
      if (attrType.substr(-5) === 'Model') {
        const subClassInstance = await this._createSubModelAttribute(instance, attrType, attrName, value)
        instance[attrName].push(subClassInstance)
      } else if (['boolean', 'number', 'string'].includes(attrType)) {
        instance[attrName].push(this._validateAndGetValue(attrType, attrName, value))
      } else {
        throw new Error(`
      Type
      '${attrType}'
      defined in class
      '${this.getClassName()}'
      is
      invalid.Must
      be
      a
      subclass
      of
      Model
      name
      or
      primitive
      types
      such
      as
      boolean, string
      or
      numbers.`)
      }
    }
  }

  /**
   * Retorna nome do arquivo da classe para importação
   *
   * @param {string} className
   *
   * @return {Promise<void>}
   * @private
   */
  static _getClassFileName (className) {
    const fileName = className.substring(0, className.length - 5)

    const syles = {
      kebabCase () {
        return kebabCase(fileName)
      },
      camelCase () {
        return camelCase(fileName)
      },
      snakeCase () {
        return snakeCase(fileName)
      }
    }

    if (!syles[this.fileCaseStyle]) {
      throw new Error(`
      Case
      style
      '${this.fileCaseStyle}'
      is
      invalid.Check
      'fileCaseStyle'
      option.`)
    }

    return syles[this.fileCaseStyle]()
  }
}
