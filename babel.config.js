module.exports = {
    presets: [
      '@babel/preset-env',         // Transpile JavaScript
      '@babel/preset-react',       // Transpile JSX syntax
      '@babel/preset-typescript',  // Transpile TypeScript
    ],
    plugins: [
      '@babel/plugin-transform-runtime',  // Helps optimize JS code for reuse
    ],
  };
  