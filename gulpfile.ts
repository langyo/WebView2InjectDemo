import { series } from 'gulp';
import { join } from 'path';
import del from 'del';
import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import { readFile, writeFile, symlink, unlink, readdir } from 'fs/promises';

export async function clean() {
  try {
    await del(join(__dirname, './dist'));
  } catch {}
  try {
    await del(join(__dirname, './bin'));
  } catch {}
  try {
    await del(join(__dirname, './obj'));
  } catch {}
}

export const build = series(async function buildScripts() {
  return await new Promise<void>((resolve, reject) =>
    webpack(
      {
        entry: join(__dirname, './src/frontend/entry.ts'),
        target: 'web',
        output: {
          filename: 'web.js',
          path: join(__dirname, './dist/build/'),
        },
        context: __dirname,
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
            {
              test: /\.scss$/,
              use: ['vue-style-loader', 'css-loader', 'sass-loader'],
            },
            {
              test: /\.ts$/,
              loader: 'ts-loader',
              options: { appendTsSuffixTo: [/\.vue$/] },
            },
          ],
        },
        optimization: {
          minimize: true,
          minimizer: [
            new (require('terser-webpack-plugin'))({
              extractComments: false,
            }),
          ],
        },
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        },
        mode:
          process.env.NODE_ENV === 'development' ? 'development' : 'production',
        ...(process.env.NODE_ENV === 'development'
          ? { devtool: 'inline-source-map' }
          : {}),
        plugins: [new VueLoaderPlugin()],
      },
      (err, stats) => {
        if (err) {
          reject(err);
        } else if (stats?.hasErrors()) {
          const info = stats.toJson();
          let errStr = '';
          if (stats.hasErrors() && typeof info.errors !== 'undefined') {
            for (const e of info.errors) {
              errStr += `${e.message}\n`;
            }
          }
          if (stats.hasWarnings() && typeof info.warnings !== 'undefined') {
            for (const e of info.warnings) {
              errStr += `${e.message}\n`;
            }
          }
          reject(Error(errStr));
        }
        resolve();
      }
    )
  );
});

export const postPublish = series(
  async function removeNETInfoFiles() {
    await unlink(
      join(__dirname, './dist/publish/win-unpacked/bin/builder.pdb')
    );
  },
  async function removeInstallerFiles() {
    for (const name of (
      await readdir(join(__dirname, './dist/publish'))
    ).filter((name) => ['win-unpacked'].indexOf(name) < 0)) {
      await unlink(join(__dirname, `./dist/publish/${name}`));
    }
  }
);
