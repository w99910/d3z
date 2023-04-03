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
    plugins: [vuePlugin({
        template: {
            transformAssetUrls: {
                // The Vue plugin will re-write asset URLs, when referenced
                // in Single File Components, to point to the Laravel web
                // server. Setting this to `null` allows the Laravel plugin
                // to instead re-write asset URLs to point to the Vite
                // server instead.
                base: null,

                // The Vue plugin will parse absolute URLs and treat them
                // as absolute paths to files on disk. Setting this to
                // `false` will leave absolute URLs un-touched so they can
                // reference assets in the public directory as expected.
                includeAbsolute: false,
            },
        },
    }), convertToIndexFileName()],
    base: 'https://w99910.github.io/d3z/',
    server: {
        open: './main.html',
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
