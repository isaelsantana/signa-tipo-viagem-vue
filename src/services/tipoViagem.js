import { HTTPClient } from '../utils/request'

export default {
  pesquisar: async payload => {
    const { data } = await HTTPClient.get('/tipoViagem')
    return data
  },
  gravar: async payload => {
    const { data } = await HTTPClient.post('/Gravar', payload)
    return data
  },
  pesquisarPorId: async payload => {
    const { data } = await HTTPClient.get(`/tipoViagem/${payload}`)
    return data
  },
  excluir: async payload => {
    const { data } = await HTTPClient.get(`/tipoViagem/Excluir/${payload}`)
    return data
  },
  pesquisarHist: async payload => {
    const {data } = await HTTPClient.get("/tipoViagem/BuscarHistorico", {params: payload})
    return data
  }
}
