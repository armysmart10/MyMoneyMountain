// webpack.config.js
module.exports = {
    resolve: {
      extensions: ['.js', '.jsx', '.mjs'],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  };
  