const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// Phaser webpack config
const phaserModule = path.join(__dirname, '../node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
    entry: {
        vendor: ['pixi', 'p2', 'phaser'],
        app: path.resolve(__dirname, '../src/index.ts')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../build'),
    },
    module: {
        rules: [
            {test: /\.ts/, exclude: /node_modules/, loader: "babel-loader"},
            {test: /\.(png|svg|jpg|gif)$/, use: ['file-loader']},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /pixi\.js/, use: ['expose-loader?PIXI']},
            {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
            {test: /p2\.js/, use: ['expose-loader?p2']}
        ]
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, '../build')]),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        })
    ],
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
}