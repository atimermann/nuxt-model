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

export default {

  data () {
    return {
      teste: null
    }
  },

  async mounted () {
    await this.$nextTick()

    this.teste = await Teste.create({
      id: 1,
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

    this.teste.name.name.mpush({
      id: 5
    })

    console.log('FINAL', '= ', this.teste)
    console.log('FINAL JSON', this.teste.toJSON())
  },

  methods: {
    change () {

      this.teste.id++
      this.teste.name.name.push({
        id: 5
      })

      this.teste.nao_existe = 123

    }

  }

}

</script>
