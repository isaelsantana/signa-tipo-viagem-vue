import Vue from 'vue'
import Vuex from 'vuex'
import rootStore from './root'

Vue.use(Vuex)

export default new Vuex.Store({
  ...rootStore
})
