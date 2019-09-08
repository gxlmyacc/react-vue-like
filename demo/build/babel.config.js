module.exports = function (options, project) {
  const browsers = require('./browsers.config');
  const path = require('path');
  return {
    // cacheDirectory: true,
    presets: [
      [
        '@babel/preset-env', 
	{ 
	  useBuiltIns: 'entry', 
	  targets: { browsers }, 
	  corejs: '2.6.5', 
	  modules: 'commonjs' 
	}
      ],
      path.resolve(__dirname, '../../preset/index.js'),
      ['@babel/preset-react', { development: options.dev, useBuiltIns: true }],
    ],
    plugins: [
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-strict-mode',
    '@babel/plugin-transform-parameters',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-transform-spread',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-transform-arrow-functions'
  ]
  };
};
