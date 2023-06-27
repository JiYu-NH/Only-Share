const path = require('path');
const fs = require('fs');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

const isProduction = process.env.NODE_ENV === 'production';

const getConfig = () => {
    let config = {};
    const envConfig = path.resolve(__dirname, '.env.json');
    const devConfig = path.resolve(__dirname, '.env.dev.json');
    const prodConfig = path.resolve(__dirname, '.env.prod.json');
    try {
        if (fs.existsSync(envConfig)) config = JSON.parse(fs.readFileSync(envConfig));
        if (isProduction) {
            if (fs.existsSync(prodConfig)) config = { ...config, ...JSON.parse(fs.readFileSync(prodConfig)) };
        } else {
            if (fs.existsSync(devConfig)) config = { ...config, ...JSON.parse(fs.readFileSync(devConfig)) };
            config['PROJECT_TITLE'] = config['PROJECT_TITLE'] + ' 开发环境';
        }
    } catch {
        console.log('读取配置文件出错');
    }
    if (Boolean(Object.keys(config).length)) {
        for (const key in config) {
            config[key] = JSON.stringify(config[key]);
        }
    }
    return config;
};

const getStyleLoaders = (pre) => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'],
                },
            },
        },
        pre,
    ].filter(Boolean);
};

const moduleConfig = {
    rules: [
        {
            test: /\.css$/,
            use: getStyleLoaders(),
        },
        {
            test: /\.less$/,
            use: getStyleLoaders('less-loader'),
        },
        {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders('sass-loader'),
        },
        {
            test: /\.styl$/,
            use: getStyleLoaders('stylus-loader'),
        },
        {
            test: /\.(jpe?g|png|gif|webp|svg)$/,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 10 * 1024,
                },
            },
        },
        {
            test: /\.(woff2?|ttf)$/,
            type: 'asset/resource',
        },
        {
            test: /\.js$/,
            include: path.resolve(__dirname, '../src'),
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                cacheCompression: false,
            },
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/vue-loader'),
            },
        },
    ],
};

const plugins = [
    new EslintWebpackPlugin({
        context: path.resolve(__dirname, '../src'),
        exclude: 'node_modules',
        cache: true,
        cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
    }),
    isProduction &&
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
        }),
    isProduction &&
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        ignore: ['**/index.html'],
                    },
                },
            ],
        }),
    new VueLoaderPlugin(),
    new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        ...getConfig(),
    }),
].filter(Boolean);

const optimization = {
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
            vue: {
                test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                name: 'vue-chunk',
                priority: 40,
            },
            libs: {
                test: /[\\/]node_modules[\\/]/,
                name: 'libs-chunk',
                priority: 10,
            },
        },
    },
    runtimeChunk: {
        name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    minimize: isProduction,
    minimizer: [
        new CssMinimizerWebpackPlugin(),
        new TerserWebpackPlugin(),
        new ImageMinimizerWebpackPlugin({
            minimizer: {
                implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
                options: {
                    plugins: [
                        ['gifsicle', { interlaced: true }],
                        ['jpegtran', { progressive: true }],
                        ['optipng', { optimizationLevel: 5 }],
                        [
                            'svgo',
                            {
                                plugins: [
                                    'preset-default',
                                    'prefixIds',
                                    {
                                        name: 'sortAttrs',
                                        params: {
                                            xmlnsOrder: 'alphabetical',
                                        },
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },
        }),
    ],
};

module.exports = {
    entry: './src/main.js',
    output: {
        path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
        filename: isProduction ? 'static/js/[name].[contenthash:10].js' : 'static/js/[name].js',
        chunkFilename: isProduction ? 'static/js/[name].[contenthash:10].chunk.js' : 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        clean: true,
    },
    module: moduleConfig,
    plugins,
    optimization,
    resolve: {
        extensions: ['.vue', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true,
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    performance: false,
};
