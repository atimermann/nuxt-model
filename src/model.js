/**
 * Created on 17/02/2021
 *
 * src/model.ts
 * @author Cheap2Ship
 *
 */

export default class SModel {
  static __class = '__BASE__'

  static context = null

  static configure(options) {
    SModel.context = options.context
    SModel.loadModelModule = options.loadModelModuleFunction
  }

  static async create(data) {

    if (!data) {
      throw new Error('Data cannot be null or undefined when creating a model.')
    }

    if (Array.isArray(data)) {
      throw new Error('Array is not allowed. To create collections use createCollection.')
    }

    if (this.__class === '__BASE__'){
      throw new Error('Instantiating the base class is not allowed')
    }


    // TODO: Testar this.name, se não funcionar forçar usuario a digitar class=nome (vai ficar redundante, mas não temos opção)
    // TODO: Também carregar por __typename (Definir prioridade)
    console.log('Name', this.name)
    console.log(this.__class)


    const instance = new this()
    // const Class = await SModel.loadModelModule('teste')


    // console.log(Class)

  }


}
