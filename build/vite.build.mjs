import { resolve as stlResolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import dts from 'vite-plugin-dts';
import minimist from 'minimist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const resolve = (...paths) => stlResolve(__dirname, '../', ...paths);

const argv = minimist(process.argv.slice(2));
// 是否开启监听
const isWatchMode = !!argv.watch;
// 模块
const libraries = [{ name: 'logger' }];
const userLibraries = (argv.lib || '').split(',');
let targetLibraries = [];

if (!userLibraries.length) {
  targetLibraries = libraries;
} else {
  targetLibraries = libraries.filter((lib) => userLibraries.includes(lib.name));
}

for (const lib of libraries) {
  const { name } = lib;

  await build({
    configFile: false,
    build: {
      watch: isWatchMode
        ? {
            include: [`packages/${name}/**/*.ts`],
          }
        : null,
      lib: {
        entry: resolve(`packages/${name}/src/index.ts`),
        formats: ['es'],
        fileName: (format) => `${name}.${format}.js`,
      },
      outDir: `packages/${name}/dist`,
    },
    plugins: [
      dts({ rollupTypes: true, outDir: `packages/${name}/dist/types` }),
    ],
  });
}
