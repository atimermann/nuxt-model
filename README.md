# Nuxt Model

Módulo que dá suporte a criação de "modelos de dados" orientado a objeto baseado em classes e relacionamento entre classes.

Este módulo permite criar objetos (instancia de classes) a partir de dados no formato JSON simples com todos os 
relacionamentos automaticamente.

# Pré-configuração

## Sugestão: Habilitar identificação automática do nome da classe (enableConstructorName)

Caso prefira que o nome das classes sejam identificadas corretamente nas mensagens de erro no ambiente de produção, pode 
adicionar a seguinte configuração no arquivo nuxt.config.js:

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

Podemos também identificar o nome da classe através do atributo **className** quando enableConstructorName for falso
como no exemplo:

```javascript
export default class TesteModel extends Model {
  static className = 'TesteModel' 
}
```
# Instalação e configuração

Execute o comando:

    npm install --save @atimermann/nuxt-model

Adicione o seguinte no arquivo nuxt.config.js:

```javascript
['@atimermann/nuxt-model/nuxt', { /* Options */}]
```

# Rêferencia

## Opções

Ao configurar o modulo no projeto, podemos definir as seguintes opções: 

| Atributo              | Descrição                                                                                                                                                                                                                                                                                   | Padrão                           |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| importPath            | Nuxt-model, carrega e instancia objetos automaticamente, através de importPath o nuxt-model consegue encontrar as classes. Está no formato "template string" e a variável "modelName" representa o nome da classe. É usado para definir a estrutura de diretório utilizado para os modelos. | "~/models/${modelName}.model.js" |
| enableConstructorName | Habilita identificação da classe pelo constructorName, caso esta opção esteja desativada é necessário especificar o nome da classe no atributo estático "class". Para ativar esta opção é necessário realizar uma pré-configuração.                                                         | true                             |
| fileCaseStyle         | Estilo de caixa (Case Style) do arquivos do model, por exemplo para kebabCase o model será sub-teste.model.js, para camelCase será subTeste.model.js.                                                                                                                                       | 'kebabCase'                      |

Table Editor: https://www.tablesgenerator.com/markdown_tables


https://dev.to/bawa_geek/how-to-setup-jest-testing-in-nuxt-js-project-5c84
