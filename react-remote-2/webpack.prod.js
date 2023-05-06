const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const deps = require('./package.json').dependencies

module.exports = {
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  plugins: [
    new ModuleFederationPlugin({
      name: 'TestRemote2',
      filename: 'remoteEntry.js',
      exposes: {
        './RemoteButtonApp': './src/bootstrap',
      },
      shared: [
        {
          react: { requiredVersion: deps.react, singleton: true },
          'react-dom': { requiredVersion: deps['react-dom'], singleton: true },
          '@emotion/styled': {
            requiredVersion: deps['@emotion/styled'],
            singleton: true,
          },
          '@emotion/react': {
            requiredVersion: deps['@emotion/react'],
            singleton: true,
          },
          '@emotion/cache': {
            requiredVersion: deps['@emotion/react'],
            singleton: true,
          },
        },
      ],
    }),
  ],
}
