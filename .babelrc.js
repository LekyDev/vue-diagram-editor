module.exports = api => {
  api.cache.never()
  const presets = [
    ['@babel/preset-env', { 
      modules: false,
      // Enable parsing of class properties
      targets: {
        esmodules: true
      }
    }],
  ]
  const plugins = []
  if (process.env.NODE_ENV === 'testing') {
    plugins.push('istanbul')
  }
  return { presets, plugins, comments: false }
}
