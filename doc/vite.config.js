import {defineConfig} from "vite";
import vuePlugin from "@vitejs/plugin-vue";

const convertToIndexFileName = () => {
    return {
        name: 'renameIndex',
        enforce: 'post',
        generateBundle(options, bundle) {
            const indexHtml = bundle['main.html']
            indexHtml.fileName = 'index.html'
        },
    }
};
export default defineConfig({
    plugins: [vuePlugin(), convertToIndexFileName()],
    base: 'https://w99910.github.io/d3z/',
    server: {
        open: './main.html',
    },
    build: {
        // minify: false,
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
