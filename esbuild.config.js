const path = require('path')

require('esbuild')
  .build({
    entryPoints: ['index.js'],
    bundle: true,
    outdir: path.join(process.cwd(), 'build'),
    absWorkingDir: path.join(process.cwd(), 'src'),
    tsconfig: path.join(process.cwd(), './tsconfig.json'),
    loader: { '.js': 'js' },
    watch: true,
  })
  .catch(() => process.exit(1))
