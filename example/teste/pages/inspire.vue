<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <p>
            IS_STATIC: {{ teste }}
          </p>
        </footer>
      </blockquote>
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

    this.teste = Teste.create({})
  }

}

</script>
