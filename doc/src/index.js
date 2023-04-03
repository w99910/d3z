import './css/app.css';

import {createApp, defineAsyncComponent} from 'vue';

import Main from "./index.vue";

const app = createApp(Main)

for (let component of Object.keys(import.meta.glob('./components/**/*.vue'))) {
    let componentName = [...component.matchAll(/([^\/]*).vue/g)][0][1];
    let componentPath = component.replace('./components/', '').replace('.vue', '');
    app.component(componentName, defineAsyncComponent(() => import('./components/' + componentPath + '.vue')))
}

app.mount('#app')
