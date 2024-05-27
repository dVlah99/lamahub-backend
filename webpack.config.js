const path = require("path");

module.exports = {
  mode: "production", // Set the mode to production
  entry: "./src/index.ts", // Entry point of your application
  target: "node", // Specify the target environment
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output filename
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply the following loaders to .ts files
        use: ["ts-loader"], // Use ts-loader for TypeScript files
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    /* new CopyPlugin({
      // Copy necessary files to the output directory
      patterns: [
        { from: "public", to: "public" }, // Assuming you have a 'public' folder
      ],
    }), */
  ],
};
