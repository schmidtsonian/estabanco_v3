export default {
  base: '/',
  root: 'src/',
  publicDir: '../static/',
  server:
  {
      host: true,
  },
  build:
  {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        'weird-cube-101': 'src/weird-cube-101/index.html',
      },
    },
  }
}