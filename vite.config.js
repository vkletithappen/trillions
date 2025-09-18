import { defineConfig } from 'vite'
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve('src/partials'),
      reloadOnPartialChange: true,
    }),
    {
      handleHotUpdate({ file, server }) {
        if (file.endsWith(".html")) {
          server.ws.send({
            type: "full-reload",
            path: "*",
          });
        }
      },
    },
  ],
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      },
    ]
  }
})
