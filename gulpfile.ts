import { series } from 'gulp';
import del from 'del';
import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { generate } from 'shortid';
import { join } from 'path';
import { readdir, unlink, writeFile, readFile } from 'fs/promises';

const isDevelopmentMode = process.argv.indexOf('--dev') >= 0;
console.log(
  `You are in the ${isDevelopmentMode ? 'development' : 'production'} mode.`
);
const compileId = generate();
console.log(
  `The unique identification code for this compilation is '${compileId}'.`
);

function resolveWebpackCompileResult(
  resolve: (sth: any) => void,
  reject: (sth: any) => void
) {
  return (err: Error, stats: webpack.Stats) => {
    if (err) {
      console.error(err);
      reject(err);
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      for (let line of info.errors) {
        console.error(line.message);
        reject(err);
      }
    }
    if (stats.hasWarnings()) {
      for (let line of info.warnings) {
        console.warn(line.message);
      }
    }
    resolve(stats);
  };
}

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

async function generateMainlyScripts() {
  await new Promise((resolve, reject) => {
    const compiler = webpack({
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
            use: 'vue-loader',
          },
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] },
              },
            ],
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'web.css',
        }),
        new VueLoaderPlugin(),
      ],
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
    });
    compiler.run(resolveWebpackCompileResult(resolve, reject));
  });
}

async function concatStyleSheets() {
  await writeFile(
    join(__dirname, './dist/build/web.css.js'),
    `(() => {
let n = document.createElement('style');
n.innerText = \`${(
      await readFile(join(__dirname, './dist/build/web.css'), 'utf8')
    )
      .split('`')
      .join('\\`')}\`;
document.body.appendChild(n);
document.getElementById('app').hidden="";
})();`
  );
}

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

export const build = series(clean, generateMainlyScripts, concatStyleSheets);

export const publish = series(build, postPublish);
