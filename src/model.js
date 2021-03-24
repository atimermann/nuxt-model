/**
 * Created on 17/02/2021
 *
 * src/model.ts
 * @author Cheap2Ship
 *
 */

import { camelCase, isPlainObject, kebabCase, snakeCase } from 'lodash'

import PrimitiveType from './types/primitive.type'
import DateType from './types/date.type'
import SubModelType from './types/sub-model.type'
import ArrayType from './types/array.type'

export default class Model {

  /**
   * Nome desta classe, usada quando enableConstructorName for falso
   *
   * @type {string}
   */
  static className = '__BASE__'

  /**
   * Usado para identificar que a classe do usuário é uma subclase de Model (nunca deve ser alterada nas subclasses)
   * @type {boolean}
   */
  static _modelClass = true

  /**
   * Objeto de contexto do Nuxt
   * @type {any}
   */
  static context = null

  /**
   * Opções do Nuxt App
   * As opções da instância raiz do Vue que incluem todos os seus plugins. Por exemplo, ao usar i18n, você pode obter acesso o $i18n através de context.app.i18n.
   *
   * @type {Vue}
   */
  static app = null
  /**
   * Store do Vuex
   * Instância da Store do Vuex. Disponível apenas se a store do vuex estiver definido.
   *
   * @type {Store}
   */
  static store = null
  /**
   * Alias do route.params.
   *
   * @type {Route}
   */
  static route = null
  /**
   * Alias do route.params.
   *
   * @type {object}
   */
  static params = null
  /**
   * Alias do route.query.
   * @type {object}
   */
  static query = null
  /**
   * Variáveis de ambiente definidas em nuxt.config.js, consulte a api env.
   * @type {object}
   */
  static env = null
  /**
   * Booleano para que você saiba se está no modo dev, pode ser útil para armazenar alguns dados em produção.
   *
   * @type {boolean}
   */
  static isDev = null
  /**
   * Booleano para que você saiba se o método/middleware é chamado a partir da substituição do módulo ativo
   * -- hot module replacement -- do webpack (verdadeiro apenas no lado do cliente, no modo dev).
   * @type {boolean}
   */
  static isHMR = null
  /**
   * Use este método para redirecionar o usuário para outra rota, o código de status é usado no lado do servidor,
   * o padrão é 302. redirect([status,] path [, query]).
   * @type {function}
   */
  static redirect = null
  /**
   * Use este método para mostrar a página de erro: error(params). Os params devem ter as propriedades statusCode e
   * message.
   *
   * @type {function}
   */
  static error = null
  /**
   * Essa é a configuração do tempo de execução (runtime config).
   * Ref: https://pt.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config
   * @type {Object}
   */
  static $config = null

  /**
   * A rota de onde foi navegado.
   * @type {Route}
   */
  static from = null

  /**
   * Útil para plugins que usam beforeNuxtRender para obter o nuxtState no lado do cliente antes da hidratação.
   * Disponível apenas no modo universal.
   * @type {Object}
   */
  static nuxtState = null

  /**
   * Usado pela instancia, armazena valores dos atributos, serão acessados via getter e setter
   *
   * @type {{}}
   * @private
   */
  __rawValues = {}

  /**
   * Link para Model pai (caso seja subModel)
   * @type {Model}
   */
  __parent = null

  /**
   * Configurção da classe, usado na inicialização do nuxt
   * @param options
   */
  static configure (options) {

    Model.loadModelModule = options.loadModelModuleFunction
    Model.enableConstructorName = options.enableConstructorName
    Model.fileCaseStyle = options.fileCaseStyle

    // Context Attributes. Ref: https://nuxtjs.org/docs/2.x/internals-glossary/context
    Model.context = options.context
    Model.app = Model.context.app
    Model.store = Model.context.store
    Model.route = Model.context.route
    Model.params = Model.context.params
    Model.query = Model.context.query
    Model.env = Model.context.env
    Model.isDev = Model.context.isDev
    Model.isHMR = Model.context.isHMR
    Model.redirect = Model.context.redirect
    Model.error = Model.context.error
    Model.$config = Model.context.$config
    Model.from = Model.context.from
    Model.nuxtState = Model.context.nuxtState

  }

  /**
   * Factory para criar nova instancia de um Model.
   * Deve ser inicializado por um JSON de dados
   *
   * @param {object} data  Dados no formato Json para ser povoar a instancaia
   *
   * @return {Promise<Model>}
   */
  static create (data) {

    const Class = this
    const instance = new Class()

    // Cria Objeto
    for (const classAttribute of Object.getOwnPropertyNames(Class)) {

      if (classAttribute.substr(-4) === 'Type') {

        const attrName = classAttribute.substring(0, classAttribute.length - 4)
        const attrType = Class[classAttribute]
        const attrInitialValue = instance[attrName]

        if (attrType.substr(-2) === '[]') {
          ArrayType.setup(instance, attrName, attrType)
        } else if (attrType.substr(-5) === 'Model') {
          SubModelType.setup(instance, attrName, attrType)
        } else if (attrType === 'date') {
          DateType.setup(instance, attrName, attrType)
        } else if (['boolean', 'number', 'string'].includes(attrType)) {
          PrimitiveType.setup(instance, attrName, attrType)
        } else {
          throw new Error(`Type "${attrType}" defined in class "${Class.getClassName()}" is invalid. Must be a subclass of Model name or primitive types such as boolean, string or numbers.`)
        }

        if (attrInitialValue !== undefined && attrInitialValue !== null) {
          delete instance[attrName]
          instance[attrName] = attrInitialValue
        }

      }
    }
    instance.setValues(data)

    return instance
  }

  /**
   * Cria uma coleção de models
   *
   * @param {object[]} collectionData
   * @return {Promise<[]>}
   */
  static createCollection (collectionData) {
    const collection = []
    const Class = this

    if (!Array.isArray(collectionData)) {
      throw new Error(`CollectionData in "${Class.getClassName()}" must be an Array. Got "${collectionData}"`)
    }

    for (const data of collectionData) {
      collection.push(Class.create(data))
    }

    return collection
  }

  /**
   * Retorna Nome da Classe
   *
   * @return {string}
   */
  static getClassName () {
    const Class = this

    return Model.enableConstructorName
      ? Class.name
      : Class.className
  }

  /**
   * Atribui vários valores de uma unica vez. Se um atributo não for definido, não será alterado
   * Utilize toJSON para todos os valores do objeto
   *
   * @param data
   */
  setValues (data) {

    const Class = this.constructor

    if (!data) {
      throw new Error(`[${Class.getClassName()}] Data cannot be null or undefined when creating a model.`)
    }

    if (Array.isArray(data)) {
      throw new TypeError(`[${Class.getClassName()}] Array is not allowed. To create collections use createCollection.`)
    }

    if (!isPlainObject(data)) {
      throw new TypeError(`[${Class.getClassName()}] Date attribute must be a plain object. ("${JSON.stringify(data)}")`)
    }

    for (const [attrName, value] of Object.entries(data)) {

      if (attrName.substr(0, 1) === '_') {
        continue
      }
      if (!Class[`${attrName}Type`]) {
        throw new Error(`There is no attribute "${attrName}" in class "${Class.getClassName()}"`)
      }
      if (value === null || value === undefined) {
        continue
      }
      this[attrName] = value
    }

  }

  /**
   * Retorna Objeto JSON deste model
   * Utilize setValues para definir valores
   *
   * @return {{}}
   */
  toJSON () {
    const result = {}

    // Getters da instancia (Criado automaticamente)
    for (const attrName of Object.getOwnPropertyNames(this)) {
      if (attrName.substr(0, 1) !== '_') {
        const attrValue = this[attrName]

        if (attrValue === undefined) {
          continue
        }

        if (Array.isArray(attrValue)) {

          result[attrName] = attrValue.map(value => {
            if (value && value.constructor._modelClass) {
              return value.toJSON()
            } else {
              return value
            }
          })

        } else if (attrValue && attrValue.constructor._modelClass) {
          result[attrName] = attrValue.toJSON()
        } else {
          result[attrName] = attrValue
        }
      }
    }

    // Getters da Classe (definido pelo usuario)
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
   * Caso tipo do atributo seja array, trata valores de acordocom o tipo
   *
   * @param instance
   * @param attrType
   * @param attrName
   * @param values
   * @return {Promise<void>}
   * @private
   */
  static createCollectionAttributeValue (instance, attrType, attrName, values) {
    // remove []
    attrType = attrType.substr(0, attrType.length - 2)

    if (!Array.isArray(values)) {
      throw new TypeError(`Attribute "${attrName}" in class "${this.getClassName()}" must be an array.`)
    }

    const collection = []
    for (const value of values) {
      collection.push(this.createAttributeValue(instance, attrType, attrName, value))
    }
    return collection
  }

  /**
   * Processa um valor, verificando o tipo relacioado a ele. se for instancia de model,t ransforma objeto em uma
   * instnacia de model, se for Date converte stringe em objeto Date, caso contrário apenas retorna valor
   *
   * Usado para criaação de coleção ou atributos do tipo array
   *
   * @param {Model}   instance  Objeto instancia de Model parar atribuir valor
   * @param {string}  attrType  Tipo de atributo
   * @param {string}  attrName  Nome do atributo
   * @param {any}     value     Valor
   * @return {Promise<void>|*}
   * @private
   */
  static createAttributeValue (instance, attrType, attrName, value) {

    if (attrType.substr(-5) === 'Model') {
      return this._createSubModelAttribute(instance, attrType, attrName, value)
    } else if (attrType === 'date') {

      if (value instanceof Date) {
        instance.__rawValues[attrName] = value
      } else if (typeof (value) === 'string') {
        instance.__rawValues[attrName] = new Date(value)
      } else {
        throw new TypeError(`Attribute "${attrName}"(${value}) must be instance of Date or type "string", get "${typeof (value)}"`)
      }

    } else if (['boolean', 'number', 'string'].includes(attrType)) {
      return value
    } else {
      throw new Error(`Type "${attrType}" defined in class "${this.getClassName()}" is invalid. Must be a subclass of Model name or primitive types such as boolean, string or numbers.`)
    }

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
  static _createSubModelAttribute (instance, attrType, attrName, value) {
    const Class = Model.loadModelModule(this._getClassFileName(attrType))

    if (!Class._modelClass) {
      throw new Error(`Class "${attrType}" must be instance of Model.`)
    }

    const subClassInstance = Class.create(value)

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
      throw new Error(`Case style "${this.fileCaseStyle}" is invalid. Check "fileCaseStyle" option.`)
    }

    return syles[this.fileCaseStyle]()
  }
}
