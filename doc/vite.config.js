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
    server: {
        open: '/main.html',
    },
    build: {
        outDir: './',
        rollupOptions: {
            input: {
                app: './main.html', // default
            },
        },
    }
})
