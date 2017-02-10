var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        index: './src/main/js/app.js'
    },
    devtool: 'source-map',
    cache: true,
    output: {
        path: './grails-app/assets/javascripts',
        publicPath: '/assets/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src/main/js'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
              debug: true
        })
    ]
};
