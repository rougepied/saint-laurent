exports.config = {
  modules: {
    wrapper: false
  },
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^bower_components/,
        'app.js': 'app/**/*.js'
      }
    }
  },
  plugins: {
    uglify: {
      mangle: false
    }
  }
}
