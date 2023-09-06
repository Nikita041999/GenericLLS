module.exports = {
    entry: './main.js',
    output: { path: __dirname, filename: 'bundle.js' },
    module: {
      loaders: [
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
              'style-loader', {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]', // Add naming scheme
                },
              },
            ],
          },
          
          // Second CSS Loader, including node_modules, allowing to load bootstrap globally over the whole project.
          {
            test: /\.css$/,
            include: /node_modules/,
            use: ['style-loader', 'css-loader']
          }
      ]
    },
  };