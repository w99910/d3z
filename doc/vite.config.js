import {defineConfig} from "vite";
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vuePlugin()],
    server: {
        open: true,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    }
})
