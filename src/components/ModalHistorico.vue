<template>
  <v-row justify="center">
    <v-dialog v-model="abrirModal" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">             
                  <template>
                    <v-card>                               
                      <v-data-table
                        v-model="table"
                        :headers="headers"
                        :items="lista"                     
                        class="elevation-1"
                        locale="pt-BR"
                        key="id"
                        :footer-props="{ itemsPerPageText: 'Linhas por página', itemsPerPage: 5 }"
                      >                    
                      </v-data-table>
                    </v-card>
                  </template>    
                </v-col>                     
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>          
          <v-btn color="blue darken-1" text @click="confirmationCancel">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import { cargaCheiaService } from '../services'
export default {
  data() {
    return {    
        headers: [
        {
          text: 'Codigo',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Tipo Viagem Id', value: 'tabTipoViagemId' },
        { text: 'Descrição Tipo Viagem', value: 'descTipoViagem' },
        { text: 'Tipo Viagem', value: 'isViagemTaxa' },
        { text: 'Usuário', value: 'nomeUsuario' },
        { text: 'Tipo Ação', value: 'descTipoAcao' }        
      ]
    }
  },
  props: ['titulo', 'aberto', 'lista'],
  computed: {
    abrirModal() {
      return this.aberto
    }
  },
  methods: {
    isNull(valor) {
      return (valor == undefined || valor == null || valor == '' || valor == '' || valor == 0)        
    },      
    confirmationCancel() {     
      this.$emit('close', false)
    },
    ...mapActions(['setToast', 'setLoading', 'resetLoading'])
  }
}
</script>
