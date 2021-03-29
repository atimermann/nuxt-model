<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <div class="text-left">
        <pre>{{ JSON.stringify(teste, undefined, '  ') }}</pre>
      </div>
      <v-btn @click="change">CHANGE</v-btn>
    </v-col>
  </v-row>
</template>
<script>

import Teste from '~/models/teste.model'
import { Model } from '@agtm/nuxt-model'

export default {

  data () {
    return {
      teste: null
    }
  },

  async mounted () {
    await this.$nextTick()

    this.teste = await Model.createFromData({
      __typename: 'Teste',
      id: 1,
      valor: 23,
      nascimento: '2020-01-01',
      name: {
        id: 2,
        __typename: 'SubTeste',
        name: [{
          id: 3,
          __typename: 'Teste'
        }, {
          id: 4,
          __typename: 'Teste'
        }]
      }
    })

    this.teste.name.name.push({
      id: 5,
      __typename: 'Teste'
    })

    this.teste.pais = 'Argentina'


    console.log('FINAL', '= ', this.teste)
    console.log('FINAL JSON', this.teste.toJSON())

    // Cadastra observers

    this.teste.onChange(function(attrName, value){
      console.log('ON CHANGE:', attrName, value)
    })
  },

  methods: {
    change () {

      this.teste.id++
      this.teste.name.name.push({
        id: 5,
        __typename: 'Teste'
      })
      this.teste.nao_existe = 123

      console.log('FINAL', '= ', this.teste)
      console.log('FINAL JSON', this.teste.toJSON())

    }

  }

}

</script>
