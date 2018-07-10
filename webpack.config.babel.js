import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import WebappWebpackPlugin from 'webapp-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

function generateHtmlPlugins (templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir)).filter((file) => {
    if (file[0] !== '_' && file.indexOf('.pug') > -1) {
      return file
    }
  })
  return templateFiles.map(item => {
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    return new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true
      },
      hash: false,
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/view')

function getFaviconAtLastArrayPosition (devMode) {
  return [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin(['build']),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin({
      // Options...
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? 'assets/css/[name].css' : 'assets/css/[name].[hash].css',
      chunkFilename: devMode ? 'assets/css/[id].css' : 'assets/css/[id].[hash].css'
    }),
    new WebappWebpackPlugin({
      logo: './src/images/favicon.png',
      prefix: 'assets/icons-[hash]/',
      inject: true,
      favicons: {
        appName: 'Pilot Digital Signage',
        background: '#fff',
        theme_color: '#333'
      }
    })
  ]
}

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production'
  console.log('devMode: ' + devMode)
  return {
    entry: {
      index: ['./src/index.js']
    },
    resolve: {
      extensions: [
        '.js',
        '.jsx'
      ]
    },
    output: {
      path: path.resolve('build'),
      filename: 'assets/js/[name].[hash].bundle.js',
      publicPath: ''
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.s?[ac]ss$/,
          use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader?sourceMap&importLoaders=1'
          },
          {
            loader: 'postcss-loader?sourceMap'
          },
          {
            loader: 'sass-loader?sourceMap'
          }]
        },
        {
          test: /\.(pug|html)$/,
          use: {
            loader: 'pug-loader',
            query: {}
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          exclude: [
            path.resolve('./src/fontello'),
            path.resolve('./src/productImages')
          ],
          use: [
            'file-loader?name=assets/img/[name].[hash].[ext]',
            'image-webpack-loader'
          ]
        },
        {
          test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          exclude: [
            path.resolve('./src/images')
          ],
          use: 'file-loader?name=assets/font/[name].[hash].[ext]'
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      stats: 'errors-only',
      port: 9000
    },
    plugins: htmlPlugins.concat(getFaviconAtLastArrayPosition(devMode))
  }
}
