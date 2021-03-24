# Nuxt Model

Módulo que dá suporte a criação de "modelos de dados" orientado a objeto baseado em classes e relacionamento entre classes.

Este módulo permite criar objetos (instancia de classes) a partir de dados no formato JSON simples com todos os 
relacionamentos automaticamente.

# Caractéristicas

* Criação de modelos de dados similar ao utilizado em ORMs no backend
* Suporta relacionamento um-para-um  e um-para-muitos
* Criação de getters para atributos dinãmicos
* Integração completa com nuxt. Ex: acessar plugins e outros métodos interno do nuxt
* Podem ser manipualado como se fossem um objeto plano (plain-object) acessando atributos diretamente (Simula um objeto plano)

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

    npm install --save @agtm/nuxt-model

Adicione o seguinte no arquivo nuxt.config.js:

```javascript
['@agtm/nuxt-model/nuxt', { /* Options */}]
```

# Estrutura de diretórios padrão

Com o Nuxt Model podemos criar relacionamento entre models, estes relacionamentos são carregados automaticamente ao 
instanciar e popular um novo objeto. 

Para que o NuxtModel saiba onde está localizado a classe relacionada, é utilizado um padrão de diretório:

* As classes dos models estão localizado dentro da pasta models
* Os arquivos das classes seguem o padrão: [NOME_DO_MODEL].model.js
* O nome do model segue o padrão "kebabCase"

**Exemplo:**

```
models\
    aluno.model.js
    carteira-do-aluno.model.js
```

Também podemos ter tipos customizados:

```
types\
    money.type.js    
```

## Customizando estrutura de diretório

Caso precisemos utilizar uma estrutura de diretório diferente, podemos alterar dois atributos na configuraçao do modulo: importPath e fileCaseStyle

Por padrão importPath é definido como:

    ~/models/${modelName}.model.js

Onde ${modelName} é substituído pelo nome do modelo

Por exemplo, podemos criar a seguinte estrutura de diretório:

```
src\
    models\
        meu-modelo\
            index.js
```

Para isso configuramos importPath como:

    ~/src/models/${modelName}/index.js


E finalmente para utilizar outro padrão de nome de modelo podemos definir fileCaseStyle como:
    
    kebabCase, camelCase ou snakeCase

Seguindo a mesma regra também podemos customizar a estrutura de diretório dos tipos padrões

# Criando um Model

Models são criados utilizando o padrão de classe do ES6, utilizando herança, getters, setters entre outros.

## Model mais simples possível

Na configuração padrão model deve ser criado na pasta models. Por exemplo, para criar um model "Aluno", na pasta models vamos criar o seguinte arquivo:

    aluno.model.js

Devemos exportar uma classe como no exemplo:

```javascript
import Model from '@atimermann/nuxt-model'

export default class AlunoModel extends Model {
  
}
```
Regras:
* Todos os models devem herdar a classe Model
* O nome do modelo deve ter o sufixo Model

## Definindo atributos

No nosso exemplo anterior não defininos nenhum atributo, ou seja nenhum valor pode ser carregado na instancia do model.
Apenas atributos definidos podem ser utilizado, isso permite validar os atributos permitidos ou exigidos no nosso model

Vamos criar alguns atributos:

```javascript
import Model from '@atimermann/nuxt-model'

export default class AlunoModel extends Model {
  static nomeType = 'string'
  static idadeType = 'number'
  static matriculadoType = 'boolean'
  static turmaType = 'turmaModel'
  static nascimentoType = 'data'
}
```
* Os atributos do model são atributos de classe, portando teve ser definidos como estático
* Todo atributo deve ser prefixado com "Type"
* Os tipos permitidos são: string, number, boolean, data, um tipo customizado, um model ou array dos tipos anteriroes.
* Para tipos simples devem ser definidos com texto em string, não utilizar os tipos do javascript.
  
## Valores iniciais

* Nome de atributos que iniciam com _ são ignorados

## Tipos Primitivos

## Tipo Date

## Tipo Array

# Criando Getters e Setters

# Instanciando e manipulando um Model

* TODO: explicar q tudo é getter e setter
* TODO: Explicar mpush
* TODO: Explicar setValue
* TODO: Alertar sobre atributos não definidos


# TODO: Integração com Nuxt

* Colocar link para documentação no nuxt

# toJSON e toString



# TODO: Tipos Customizados

* TODO: Explicar a técnica definiPropery
* TODO: observação sobre getter e setter assincrono
* TODO: explocar __rawValues
* TODO: Exemplos de tipos customizados: formatação, internacionalização, 
* TODO: explicar integração com nuxt this.constructor

# Rêferencia

## Opções

Ao configurar o modulo no projeto, podemos definir as seguintes opções: 

| Atributo              | Descrição                                                                                                                                                                                                                                                                                   | Padrão                           |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| importPath            | Nuxt-model, carrega e instancia objetos automaticamente, através de importPath o nuxt-model consegue encontrar as classes. Está no formato "template string" e a variável "modelName" representa o nome da classe. É usado para definir a estrutura de diretório utilizado para os modelos. | "~/models/${modelName}.model.js" |
| typeImportPath        / Regra de carregamento para os tipos customizados.                                                                                                                                                                                                                                           | "~/types/${typeName}.type.js"    |
| enableConstructorName | Habilita identificação da classe pelo constructorName, caso esta opção esteja desativada é necessário especificar o nome da classe no atributo estático "class". Para ativar esta opção é necessário realizar uma pré-configuração.                                                         | true                             |
| fileCaseStyle         | Estilo de caixa (Case Style) do arquivos do model, por exemplo para kebabCase o model será sub-teste.model.js, para camelCase será subTeste.model.js.                                                                                                                                       | 'kebabCase'                      |

Table Editor: https://www.tablesgenerator.com/markdown_tables


https://dev.to/bawa_geek/how-to-setup-jest-testing-in-nuxt-js-project-5c84


# Melhorias Futuras

* TODO: Opção para validar __typename (util para graphql,  valida se os tipo de dados é correto)
* TODO: Propriedades customizada de cada atributo para ser utilizado externamente
