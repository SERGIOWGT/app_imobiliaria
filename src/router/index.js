import Vue from 'vue'
import Router from 'vue-router'

import store from '../store.js'
import loginView from '../useCases/login/views/LoginView.vue'
import homeView from '../useCases/Home/views/HomeView.vue'
import inquilinoView from '../views/InquilinoView.vue'
import contratoAluguelView from '../useCases/ContratoAluguel/views/ContratoAluguelView'
import imovelView from '../views/ImovelView.vue'
import movimentacaoMensalView from '../views/MovimentacaoMensalView.vue'

Vue.use(Router)

const routes = [
    
    {
        path: '/login',
        name: 'loginView',
        component: loginView
    },
    {
        path: '/home',
        name: 'homeView',
        component: homeView
    },
    {
        path: '/imovel',
        name: 'imovelView',
        component: imovelView
    },
    {
        path: '/inquilino',
        name: 'inquilinoView',
        component: inquilinoView
    },
    {
        path: '/movimentacaoMensal',
        name: 'movimentacaoMensalView',
        component: movimentacaoMensalView
    },
    {
        path: '/contratoAluguel',
        name: 'contratoAluguelView',
        component: contratoAluguelView
    },
]

//
const RotasApp = new Router({routes})


RotasApp.beforeEach((to, from, next) => {
    //console.log("from", from.path)
    //console.log("to", to.path)
    //console.log(`from => ${from.path}, to => ${to.path},  estaLogado => ${store.getters.estaLogado}`)

/*     if (to.path == '/')
        next()
    else { */
        if (!store.getters.estaLogado) {
            if ((to.path == '/trocaSenha') || (to.path=='/registraUsuario')) {
                next()
            } else if (to.path != '/login') 
                next('/login') 
            else
                next()
        } else {
            next()
        }
/*     } */
    
  })

export default RotasApp