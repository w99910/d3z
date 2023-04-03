import './css/app.css';

import {createApp, h, defineAsyncComponent} from 'vue';

import Main from "./index.vue";

const app = createApp(Main)

const components = import.meta.glob('./components/**/*.vue');

for (let component of Object.keys(components)) {
    let componentName = [...component.matchAll(/([^\/]*).vue/g)][0][1];
    let componentPath = component
        .replace('./', '')
        .replace('.vue', '');
    app.component(componentName, defineAsyncComponent(() => components[component]()))
}

app.mount('#app')
