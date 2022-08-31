import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default {
  mode: 'production',
  entry: './src/index.js',

  output: {
    path: join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: {
      name: "ES6MixinNano",
      type: 'umd',
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: join(__dirname, 'src'),
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};

