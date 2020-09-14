<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <h1 class="titulo-principal">Cadastro Tipo Viagem</h1>
      </v-flex>

      <v-flex xs12>
        <v-form ref="formTipoViagem" lazy-validation>
          <v-row style="margin-top: 30px;">
            <v-col cols="2">
              <v-text-field label="Codigo" v-model="form.id" outlined dense disabled></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Nome Tipo Viagem"
                v-model="form.descTipoViagem"
                :rules="nomeTipoViagemRules"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-switch v-model="form.isViagemTaxa" :label="`Viagem Taxa:`"></v-switch>
            </v-col>
          </v-row>

          <v-flex x12 float-left>
            <v-btn id="btnGravar" class="mr-4 botao-azul botao-medio" @click="gravar">Gravar</v-btn>
            <v-btn id="btnGravar" class="mr-4 botao-azul botao-medio" :disabled="isNull(form.id)" @click="excluir"
              >Excluir</v-btn
            >
            <v-btn id="btnGravar" class="mr-4 botao-azul botao-medio" @click="carregarHist({}, true)"
              >Hist. Exclusão</v-btn
            >
            <v-btn id="btnLimpar" class="mr-4 botao-medio" color="primary" outlined @click="limpar">Limpar</v-btn>
            <v-btn id="btnVoltar" class="mr-4 botao-medio" color="primary" outlined @click="voltar">Sair</v-btn>
          </v-flex>

          <v-flex xs12 md12 style="margin-top: 47px;" v-show="listaTipoTaxa.length > 0">
            <template>
              <v-card>
                <v-card-title>
                  <p class="titulo-table">Tipo viagem</p>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Pesquisar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  v-model="table"
                  :headers="headers"
                  :items="listaTipoTaxa"
                  :search="search"
                  class="elevation-1"
                  locale="pt-BR"
                  key="id"
                  :footer-props="{ itemsPerPageText: 'Linhas por página', itemsPerPage: 5 }"
                >
                  <template v-slot:item.action="{ item }">
                    <v-icon class="mr-2" @click="carregarHist(item, false)">history</v-icon>
                    <v-icon class="mr-2" @click="carregarTipoViagem(item)">edit</v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </template>
            <ModalHistorico :titulo="titulo" :aberto="abrirModal" :lista="listaHist" @close="fecharModal" />
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { tipoViagemService } from '../services'
import ModalHistorico from './ModalHistorico'
export default {
  components: { ModalHistorico },
  data() {
    return {
      abrirModal: false,
      titulo: '',
      table: '',
      isHistExclusao: false,
      formTipoViagem: false,
      pagination: {
        sortBy: 'name'
      },
      obj: {},
      form: {
        descricaoAgrupamento: '',
        id: '',
        isViagemTaxa: ''
      },
      nomeTipoViagemRules: [v => !!v || 'Nome Nome Tipo Viagem é obrigatório.'],
      listaTipoTaxa: [],
      listaHist: [],
      search: '',
      headersFornecedor: [
        {
          text: 'Filial',
          value: 'descricao',
          width: '180px'
        }
      ],
      headers: [
        {
          text: 'Codigo',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Nome Tipo Viagem', value: 'descTipoViagem' },
        { text: 'Viagem Taxa', value: 'isViagemTaxa' },
        { text: '*****', value: 'action', sortable: false }
      ]
    }
  },
  created() {
    this.pesquisarLista()
  },
  mounted() {},
  methods: {
    fecharModal(item) {
      this.abrirModal = item
    },
    async gravar() {
      try {
        if (this.$refs.formTipoViagem.validate()) {
          this.form = await tipoViagemService.gravar(this.form)
          this.setToast({
            message: 'Gravação Realizada com sucesso.',
            time: 5000
          })
          this.pesquisarLista()
        }
      } catch (error) {
        this.setToast({
          color: 'warning',
          message: (error.response && error.response.data.Message) || error.message,
          time: 10000
        })
      }
    },
    buscarHistExclusao() {},
    async excluir() {
      try {
        this.form = await tipoViagemService.excluir(this.form.id)
        this.setToast({
          message: 'Exclusão Realizada com sucesso.',
          time: 5000
        })
        this.pesquisarLista()
      } catch (error) {
        this.setToast({
          color: 'warning',
          message: (error.response && error.response.data.Message) || error.message,
          time: 10000
        })
      }
    },
    limpar() {
      this.$refs.formTipoViagem.resetValidation()

      this.form = {
        descricaoAgrupamento: '',
        id: '',
        isViagemTaxa: ''
      }
    },
    isNull(valor) {
      if (valor == undefined || valor == null || valor == '' || valor == '' || valor == 0) {
        return true
      } else {
        return false
      }
    },
    carregarHist(item, isHistExclusao) {
      this.obj = item
      this.titulo = isHistExclusao ? 'Histórico de Exclusão' : 'Histórico'
      this.pesquisarHist(item, isHistExclusao)
      this.abrirModal = true
    },
    carregarTipoViagem(item) {
      this.form = item
      this.form.isViagemTaxa = this.form.isViagemTaxa == 'Sim'
    },
    async pesquisarHist(item, isHistExclusao) {
      try {
        var filtro = isHistExclusao ? { tabTipoAcaoId: 3 } : { id: item.id }
        this.listaHist = await tipoViagemService.pesquisarHist(filtro)

        this.listaHist = this.listaHist.map(x => {
          x.isViagemTaxa = x.isViagemTaxa ? 'Sim' : 'Não'
          return x
        })
      } catch (error) {
        this.setToast({
          color: 'warning',
          message: (error.response && error.response.data.Message) || error.message,
          time: 10000
        })
      }
    },
    async pesquisarLista() {
      try {
        this.listaTipoTaxa = await tipoViagemService.pesquisar()

        this.listaTipoTaxa = this.listaTipoTaxa.map(x => {
          x.isViagemTaxa = x.isViagemTaxa ? 'Sim' : 'Não'
          return x
        })

        if (this.listaTipoTaxa.length == 0) {
          this.setToast({
            message: 'Nenhuma informação encontrada.',
            time: 5000
          })
        }
      } catch (error) {
        this.setToast({
          color: 'warning',
          message: (error.response && error.response.data.Message) || error.message,
          time: 10000
        })
      }
    },
    voltar() {
      window.location = '../../MENUPR.ASP'
    },
    ...mapActions(['setToast', 'setLoading', 'resetLoading'])
  }
}
</script>
<style>
.titulo-principal {
  top: 86px;
  left: 296px;
  height: 38px;
  width: auto !important;
  text-align: left;
  font: Semibold 28px/38px Open Sans;
  letter-spacing: 0;
  color: #005799;
  opacity: 1;
}
.text-agrupamento {
  top: 184px;
  left: 294px;
  width: 334px;
  height: 48px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 5px;
  opacity: 1;
}
.label-agrupamento {
  top: 154px;
  left: 294px;
  height: 22px;
  text-align: left;
  font: Regular 16px/22px Open Sans;
  letter-spacing: 0;
  color: #475257;
  opacity: 1;
}
.botao-azul {
  background: #3498db 0% 0% no-repeat padding-box !important;
  color: #ffffff !important;
}
.botao-neutro {
  top: 878px;
  left: 412px;
  width: 100px;
  height: 40px;
  border: 1px solid #3498db;
  border-radius: 4px;
  opacity: 1;
}
.titulo-table {
  top: 284px;
  left: 316px;
  width: 234px;
  height: 27px;
  text-align: left;
  font: Semibold 20px/27px Open Sans;
  letter-spacing: 0;
  color: #475257;
  opacity: 1;
}

.botao-medio {
  height: 40px !important;
  text-align: center !important;
  font: Regular 14px/30px Open Sans !important;
  letter-spacing: 0 !important;
  width: 100px !important;
}
</style>
