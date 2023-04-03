import './src/css/app.css';

import {createApp, defineAsyncComponent} from 'vue';

import Main from "./src/index.vue";


const app = createApp(Main)

for (let component of Object.keys(import.meta.glob('./src/components/**/*.vue'))) {
    let componentName = [...component.matchAll(/([^\/]*).vue/g)][0][1];
    let componentPath = component.replace('./src/components/', '').replace('.vue', '');
    app.component(componentName, defineAsyncComponent(() => import('./src/components/' + componentPath + '.vue')))
}

app.mount('#app')
