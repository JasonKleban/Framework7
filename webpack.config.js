const path = require('path')
const fs = require('fs')
const config = require('./scripts/config.js')
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const components = () =>
  config.components.map((name) => {
    return {
      path: `./src/components/${name}/${name}.ts`,
      name,
      capitalized: name.split('-').map((word) =>
        word.split('').map((char, index) =>
          index === 0
          ? char.toUpperCase()
          : char)
        .join(''))
      .join('')
    };
  })
  .filter(component => fs.existsSync(component.path));

module.exports = {
  entry: './src/framework7.ts',
  output: {
    filename: './build/js/framework7.js'
  },
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: path.resolve('./src/framework7.ts', 'utf8'),
        loader: template => {
          return fs.readFileSync(template.resource)
            .replace(/process\.env\.NODE_ENV/g, JSON.stringify(process.env.NODE_ENV || 'development')) // or 'production'
            .replace(/\/\/IMPORT_COMPONENTS/g, components.map(component => `import ${component.capitalized} from './components/${component.name}/${component.name}';`).join('\n'))
            .replace(/\/\/INSTALL_COMPONENTS/g, components.map(component => `.use(${component.capitalized})`).join('\n  '));
        },
      },
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // disable type checker - we will use it in fork plugin
          //transpileOnly: true,
          compilerOptions: {
            target: 'es5',
            module: 'commonjs',
            noEmit: false
          }
        }
      }
    ]
  },
  plugins: [
    new DeclarationBundlerPlugin({
        moduleName:'Framework7',
        out:'./build/js/framework7.d.ts',
    })
    //new ForkTsCheckerWebpackPlugin()
  ]
}
