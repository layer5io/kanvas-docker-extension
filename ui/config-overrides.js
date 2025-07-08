const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        url: require.resolve('url'),
        fs: require.resolve('fs'),
        assert: require.resolve('assert'),
        path: require.resolve('path-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
    };
    
    // Handle the @docker/docker-mui-theme ES6 module issue
    config.module.rules.unshift({
        test: /\.js$/,
        include: /node_modules\/@docker\/docker-mui-theme/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    ['@babel/preset-env', {
                        modules: 'auto',
                        targets: {
                            browsers: ['last 2 versions']
                        }
                    }],
                    '@babel/preset-react'
                ],
                plugins: [
                    '@babel/plugin-transform-modules-commonjs'
                ]
            }
        }
    });
    
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
}