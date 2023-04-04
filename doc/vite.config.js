import {defineConfig} from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import {rm} from 'node:fs/promises'
import {resolve} from 'node:path'

const prepare = () => {
    return {
        name: 'renameIndex',
        enforce: 'post',
        async buildStart() {
            await rm(resolve(__dirname, 'assets'), {recursive: true, force: true});
        },
        generateBundle(options, bundle) {
            const indexHtml = bundle['main.html']
            indexHtml.fileName = 'index.html'
        },

    }
};
export default defineConfig({
    plugins: [vuePlugin(), prepare()],
    server: {
        open: './main.html',
    },
    build: {
        outDir: './',
        rollupOptions: {
            input: {
                app: './main.html', // default
            },
            external: [
                /^components\/*.vue$/
            ],
        },
    }
})
