# Nuxt Model

Módulo que dá suporte a criação de "modelos de dados" orientado a objeto baseado em classes e relacionamento entre
classes.

Este módulo permite criar objetos (instancia de classes) a partir de dados no formato JSON simples com todos os
relacionamentos automaticamente.

# Caracteristicas

* Criação de models de dado similar ao utilizado em ORMs no backend
* Suporta relacionamento um-para-um e um-para-muitos
* Criação de getters para atributos dinãmicos
* Integração completa com nuxt. Exemplo: acessar plugins e outros métodos interno do nuxt
* Podem ser manipualado como se fossem um objeto plano (plain-object) acessando atributos diretamente (Simula um objeto
  plano)
* Suporte a tipos customizados (exemplo: tradução automática)

# Pré-configuração

## Habilitar identificação automática do nome da classe (enableConstructorName)

Caso prefira que o nome das classes sejam identificadas corretamente nas mensagens de erro no ambiente de produção, pode
adicionar a seguinte configuração no arquivo nuxt.config.js:

**NOTA:** Caso habilite a opção "typeValidation", e não queira utilizar className, está configuração será necessária.

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
['@agtm/nuxt-model/nuxt', { /* Options */ }]
```

# Estrutura de diretórios padrão

Ao intanciar um novo Model, caso este Model tenha relacionamentos, esses relacionamentos são instancia de outros Models.
O NuxtModel importa automaticamente a classe do Model relacionado.

Para que o NuxtModel saiba onde está localizado a classe, é utilizado um padrão de diretório:

* As classes dos models estão localizado dentro da pasta models
* Os arquivos das classes seguem o padrão: [NOME_DO_MODEL].model.js
* O nome do model segue o padrão "kebab-case"

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

Caso precisemos utilizar uma estrutura de diretório diferente, podemos alterar dois atributos na configuraçao do modulo:
importPath e fileCaseStyle

Por padrão importPath é definido como:

    ~/models/${modelName}.model.js

Onde ${modelName} é substituído pelo nome do model

Por exemplo, podemos criar a seguinte estrutura de diretório:

```
src\
    models\
        meu-model\
            index.js
```

Para isso configuramos importPath como:

    ~/src/models/${modelName}/index.js

E finalmente para utilizar outro padrão de nome de model podemos definir fileCaseStyle como:

    kebabCase, camelCase ou snakeCase

Seguindo a mesma regra também podemos customizar a estrutura de diretório dos tipos padrões

# Criando um Model

Models são criados utilizando o padrão de classe do ES6, utilizando herança, getters, setters entre outros.

## Model mais simples possível

Na configuração padrão model deve ser criado na pasta models. Por exemplo, para criar um model "Aluno", na pasta models
vamos criar o seguinte arquivo:

    aluno.model.js

Devemos exportar uma classe como no exemplo:

```javascript
import { Model } from '@agtm/nuxt-model'

export default class AlunoModel extends Model {

}
```

Regras:

* Todos os models devem herdar a classe Model
* O nome do model deve ter o sufixo Model

## Definindo atributos

No nosso exemplo anterior não defininos nenhum atributo, ou seja nenhum valor pode ser carregado na instancia do model.
Apenas atributos definidos podem ser utilizado, isso permite validar os atributos permitidos ou exigidos no nosso model

Vamos criar alguns atributos:

```javascript
import { Model } from '@agtm/nuxt-model'

export default class AlunoModel extends Model {
  static nomeType = 'string'
  static idadeType = 'number'
  static matriculadoType = 'boolean'
  static turmaType = 'turmaModel'
  static nascimentoType = 'date'
}
```

* Os atributos do model são atributos de classe, portando teve ser definidos como estático
* Todo o nome de atributo deve ser sufixado com "Type"
* Os tipos permitidos são: 'string', 'number', 'boolean', 'date', um tipo customizado, um model ou array dos tipos
  anteriroes.
* Para tipos simples devem ser definidos com texto em 'string', não utilizar os tipos do javascript.

**IMPORTANTE:**  Nome de atributos que iniciam com _ são ignorados

## Valores iniciais

Podemos definir valores iniciais no nosso model, para isso simplesmente declare um atributo estatico diretamente como no
exemplo:

```javascript
import { Model } from '@agtm/nuxt-model'

export default class TesteModel extends Model {
  static idType = 'number'
  static profissaoType = 'string'

  id = 123
  profissao = 'Desenvolvedor'
}
```

# Criando Getters e Setters

Podemos criar getters e setters nos models para atributos dinamicos, implementando qualquer lógica desejada, como:
acesso a informações do nuxt, formatação de dados (tanto no setter quanto no getter) entre outros:

Por exemplo:

```javascript
import { Model } from '@agtm/nuxt-model'

export default class TesteModel extends Model {
  static nameType = 'string'
  static sobrenomeType = 'string'

  /**
   * Se o Nuxt estpa no modo desenvolvimento
   *
   * @return {boolean|*}
   */
  get idDev () {
    return Model.context.isDev
  }

  get nomeCompleto () {
    return `${this.name} ${this.sobrenome}`
  }

  set apelido (value) {
    this._callObservers('apelido', value)
  }
}
```

**IMPORTANTE:** Sempre que criar um 'Setter', necessário chamar o método this.__callObservers(NOME_DO_ATRIBUTO,
NOVO_VALOR)
para que o evento onChange funcione para este setter

# Tipos

Todo o atributo no Nuxt Model tem um tipo, esse tipo é utilizado para transformar ou validar dados. Podemos utilizar
tipos pré-definidos ou criar um tipo customizado.

## Tipos Pré-definidos

### Tipos Primitivos

São tipos básicos do javascript:
https://developer.mozilla.org/en-US/docs/Glossary/Primitive

No Nuxt Model são permitidos:

    string, number, bigint, boolean e symbol

undefined e null, são tratado como dados vazio e portanto são ignorados.

Os dados são validados se estão no seu tipo correto.

### Tipo Date

No tipo Date, somente são permitidos tipo primitivo string ou instancia do objeto Date do javascript.

Caso seja do tipo string será convertido para Date.

### Sub Model

No Nuxt Model podemos criar atributos especiais que são outros models criando relacionamento entre models.

Para criarmos um atributo do tipo "Model", precisamos colocar o nome do "model" no tipo, e todo "model" tem o sufixo "
Model"

Por exemplo:

```javascript
// aluno.model.js
export default class AlunoModel extends Model {
  static idType = 'number'
  static nameType = 'string'
  static sobrenomeType = 'string'

  get nomeCompleto () {
    return `${this.name} ${this.sobrenome}`
  }
}

// turma.model.js
import { Model } from '@agtm/nuxt-model'

export default class Turma extends Model {
  static alunoType = 'AlunoModel'
}

// exemplo.js
const turma = await Turma.create({
  aluno:
    {
      id: 1,
      nome: 'João',
      sobrenome: 'Silva'
    }
})

console.log(turma.aluno.nomeCompleto)
// João Silva

```

**NOTA:** Submodels são instanciados internamente automaticamente pelo Nuxt Model

### Array

Array é um tipo especial que representa um array de tipos, por exemplo:

```javascript
export default class AlunoModel extends Model {
  static nameType = 'string[]'
}

```

* Para definir um array, necessário criar o sufixo "[]"
* Só podemos criar array de tipos primitivos, date e submodel. Tipos customizados não são permitidos.

Exemplo:

```javascript
 const escola = await Escola.create({
  turma: {
    alunos: [
      {
        id: 1,
      }, {
        id: 2
      }
    ]
  }
})

escola.turma.alunos.push({
  id: 5
})

```

## Tipos Customizados

Com tipos customizados podemos validar dados antes de atribuir, formatar, criar atributos dinamicos entre outros.

O objetivo principal dos tipos customizados é evitar código repetitivo, pois tudo que pode ser criado com tipo, poderia
ser criados com 'getters' e ‘setters’ no model. Porém, existem casos em que utilizamos a mesma lógica em muitos models
do nossso projeto, por exemplo, formatação de dados monetários.

Podemos então criar um tipo especial 'money' e toda a vez que for ler o atributo já vem no formato correto.

Por padrão os tipos customizados devem ser criado na pasta "types" na raiz do projeto.

**NOTA:** Este comportamento pode ser alterado pela opção "typeImportPath". Segue a mesma regra dos models.

Vamos criar um tipo customizado chamado money:

```javascript
// /types/money.type.js

import { cloneDeep } from 'lodash'
import { ModelType } from '@agtm/nuxt-model'

export default class MoneyType extends ModelType {

  static setup (instance, attrName, attrType) {

    Object.defineProperty(instance, attrName, {
      get () {
        if (instance.__rawValues[attrName] !== undefined) {
          return 'R$ ' + instance.__rawValues[attrName].toFixed(2)
        }
      },
      set (value) {
        instance.__rawValues[attrName] = cloneDeep(value)
        instance.__callObservers(attrName, value)
      }
    })
  }
}

// exemplo.js:

this.teste = await Teste.create({
  valor: 23.3,
})

console.log(teste.valor)
// R$ 23.30

```

Note que criar um Tipo customizado, precisamos criar um método setup obrigatório, que ira alterar a instância do model.

O método setup recebe três parâmetros:

* instance: Instancia de Model onde devemos obter/gravar o valor do atributo
* attrName: Nome do atributo, no nosso exemplo "valor"
* attrType: Tipo do atributo, no nosso caso "money"

Veja que o método setup é bastante livre para fazemos qualquer manipulação que quisermos.

**IMPORTANTE:** Necessário chamar o método instance.__callObservers(NOME_DO_ATRIBUTO, NOVO_VALOR) no set para que o
evento onChange funcione para este tipo,

### __rawValues e Object.defineProperty

Aqui é importante entender o funcionamento interno de um model, todos os valores não são armazenados por padrão no
atributo da instancia e sim dentro de um objeto chamado "__rawValues".

Utilizamos getters e setters para ler o valor armazenado ali.

Todos os tipos internos são implentados usando esta técnica.

O valor diretamente no atributo da instância é lido apenas na inicialização para definir o valor inicial, em seguida é
descartado.

Podemos alterar todo esse comportamento caso desejarmos, porém por padrão utilizamos Object.defineProperty para criarmos
getters e setters que irão obter/gravar o valor em __rawValues.

Observe outros exemplos dentro do projeto nuxt-model na pasta "src/types"

### Getters e Setters assincronos

Não foi testado, veja mais detalhes em:
https://medium.com/trabe/async-getters-and-setters-is-it-possible-c18759b6f7e4

# Integração com nuxt

O Nuxt Model tem integração com o nuxt, métodos e atributos estão definidos na classe.

Por exemplo:

```javascript
'use strict'

import { Model } from '@agtm/nuxt-model'

export default class TesteModel extends Model {
  get isStatic () {
    return Model.context.isStatic + this.id
  }
}
```

Também é possível utilizar this.constructor

```javascript
'use strict'

import { Model } from '@agtm/nuxt-model'

export default class TesteModel extends Model {
  get isStatic () {
    return this.constructor.context.isStatic + this.id
  }
}
```

Documentação no Nuxt:

* https://nuxtjs.org/docs/2.x/internals-glossary/context
* https://nuxtjs.org/docs/2.x/internals-glossary/$nuxt

# Instanciando e manipulando um Model

Com os Models criados, podemos instanciar da seguinte forma:

```javascript
 this.teste = await Teste.create({
  id: 1,
  valor: 23.34,
  nascimento: '2020-01-01',
  name: {
    id: 2,
    name: [{
      id: 3,
      __typename: 'teste'
    }, {
      id: 4
    }]
  }
})
```

## Atribuindo

Podemos atribuir normalmente como se fosse um objeto javascript:

```javascript
this.teste.pais = 'Argentina'
```

Se o tipo por um submodel, será instanciado um novo Model do tipo especificado automaticamente.

## SetModels

Podemos atribuir varios valores de uma vez com setValues:

```javascript
    this.teste.setValues({
  id: 2,
  valor: 50,
})
```

* No exemplo, apenas 'id' e 'valor' serão alterados. Atributos não especificados não serão alterados.

## Atributos não definidos

**IMPORTANTE:** Se passar um atributo não definido no model via metodos "create" e "setValues", a Model irá validar
automaticamente, exibindo um erro que o atributo não existe.

Porém, se atribuir diretamente:

```javascript
this.teste.pais = 'Argentina'
```

**IMPORTANTE:**
Nenhum erro será disparado, porém o atributo será ignorado por métodos como toJSON e toString ou poderá ser exluído a
qualquer momento. Portando nunca utilize um atributo não definido no model.

Observers também não funcionarão para atributos não definidos.

Isso ocorre porque no javascript não é possível criar getters e setters genericos, impossibilidando a validação.

# toJSON e toString

O método toJson() retorna um objeto plano representando o model (é o equivalente ao setModels invertido).

Use toString() pra uma representação textual do json

# Validação extra para dados

Se os dados em JSON utilizado ao instanciar um movo Model conter informação de tipo, podemos utilizar para realizar uma
validação extra.

Por exemplo, o GraphQl envia com os dados um atributo especial "__typename" para identificar o tipo do dado enviado.

Podemos validar se esse tipo é o mesmo tipo do model criado. Para isso precisamos definir a opção "typeValidation"
como "__typename"

## Criando um Model inferindo o tipo a partir dos dados JSON

Caso typeValidation esteja habilitado, podemos instanciar um novo model com o método **createFromData**.

Por exemplo:

```javascript
 //Em vez de fazer:
AlunoModel.create(data)

// Podemos utilizar:
Model.createFromData(data)
```

Útil quando não sabemos qual Model será enviado pelo backend.

# Atributos estendidos

Podemos adicionar outras propriedades aos atriburos do Model (por exemplo para criação de um formulário).

Podemos definir atributos como required, minLengt etc...

Importante notar que com exceção do atributo type, os outros atributos serão ignorado pelo nuxt Model, sendo útil apenas
para aplicações externas (como nuxt form)

Exemplo:

```javascript
import { Model } from '@agtm/nuxt-model'

export default class TesteModel extends Model {
  static nameType = {
    type: 'SubTesteModel',
    required: true
  }
}
```

Note que é um atributo de classe, na instância terá q acessar da seguinte forma:

```javascript
  console.log(meu_model.constructor.nameType.required)

```

# Evento OnChange (Observers)

Podemos criar um evento que será chamado sempre que alguma alteração ocorrer no Model, veja o exemplo:

```javascript
this.aluno = await Aluno.create({name: 'João'})
this.aluno.onChange(function (attrName, value) {
  console.log('ON CHANGE:', attrName, value)
})
```

**NOTA:** Só é possivel criar eventos, não é possível remove-los, tome cuidado.

# Rêferencia

## Opções

Ao configurar o modulo no projeto, podemos definir as seguintes opções:

| Atributo              | Descrição                                                                                                                                                                                                                                                                                          | Padrão                           |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| importPath            | Nuxt-model, carrega e instancia objetos automaticamente, através de importPath o nuxt-model consegue encontrar as classes. Está no formato "template string" e a variável "modelName" representa o nome da classe. É usado para definir a estrutura de diretório utilizado para os models.        | "~/models/${modelName}.model.js" |
| typeImportPath        | Regra de carregamento para os tipos customizados.                                                                                                                                                                                                                                                  | "~/types/${typeName}.type.js"    |
| enableConstructorName | Habilita identificação da classe pelo constructorName, caso esta opção esteja desativada é necessário especificar o nome da classe no atributo estático "class". Para ativar esta opção é necessário realizar uma pré-configuração.                                                                | true                             |
| fileCaseStyle         | Estilo de caixa (Case Style) do arquivos do model, por exemplo para kebabCase o model será sub-teste.model.js, para camelCase será subTeste.model.js.                                                                                                                                              | 'kebabCase'                      |
| typeValidation        | Se definido, irá validar se um objeto de valores vinculado à um model está correto. Por exemplo, no graphql é utilizado _typename junto com o json de dados para identificar o tipo do objetos, caso seja definido o atributo será obrigatorio no objeto de dados utilizado por create e setValue. | undefined                      |

Table Editor: https://www.tablesgenerator.com/markdown_tables

https://dev.to/bawa_geek/how-to-setup-jest-testing-in-nuxt-js-project-5c84


## Issues

* Nuxt Model não é reativo no Vue, pesquisar uma solução, por enquanto utilizar:
  * [model].onChange(() => this.$forceUpdate())
  * Tomar cuidado com performance, testar com formulário grande

* setValues, onChange, pode dar conflitos, usar $setValues, $onChange, $toJson
