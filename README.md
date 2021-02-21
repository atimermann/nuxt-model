# Nuxt Model

Módulo que dá suporte a criação de "modelos de dados" orientado a objeto baseado em classes e relacionamento entre classes.

Este módulo permite criar objetos (instancia de classes) à partir de dados no formato JSON simples, com todo os 
relacionamentos automaticamente.

# Pré-configuração

## Habilitar identificação automática do nome da classe (enableConstructorName)

Para o nuxt-model conseguir identificar automaticamente o nome das classes é necessário adicionar a seguinte configuração no arquivo nuxt.config.js:

```javascript
build: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true
          }
        })
      ]
    }
  }
```
Por padrão ao comprimir/otimizar o código para produção, o nome de classes são renomeados para nomes compactados.

REFs:
* https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#optimization
* https://webpack.js.org/configuration/optimization/#optimizationminimize
* https://webpack.js.org/plugins/terser-webpack-plugin/

Caso não posso realizar essas modificações, ao criar uma classe model é necessário definir enableConstructorName para 
false e identificar o nome da classe novamente com **className** como no exemplo:

```javascript
export default class TesteModel extends Model {
  static className = 'TesteModel' 
}
```




# Rêferencia


| Atributo              | Descrição                                                                                                                                                                                                                                                                                   | Padrão                           |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| importPath            | Nuxt-model, carrega e instancia objetos automaticamente, através de importPath o nuxt-model consegue encontrar as classes. Está no formato "template string" e a variável "modelName" representa o nome da classe. É usado para definir a estrutura de diretório utilizado para os modelos. | "~/models/${modelName}.model.js" |
| enableConstructorName | Habilita identificação da classe pelo constructorName, caso esta opção esteja desativada é necessário especificar o nome da classe no atributo estático "class". Para ativar esta opção é necessário realizar uma pré-configuração.                                                         | true                             |
| fileCaseStyle         | Estilo de caixa (Case Style) do arquivos do model, por exemplo para kebabCase o model será sub-teste.model.js, para camelCase será subTeste.model.js.                                                                                                                                       | 'kebabCase'                      |
