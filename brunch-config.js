exports.config = {
  modules: {
    wrapper: false
  },
  files: {
    javascripts: {
      joinTo: {
        "vendor.js": /^bower_components/,
        "app.js": "app/**/*.js"
      }
    }
  },
  plugins: {
    uglify: {
      mangle: false
    },
    jshint: {
      pattern: /^app[\\\/].*\.js$/,
      options: {
        esnext: true,
        strict: false,
        globalstrict: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        predef: ["document", "window", "moment", "HTMLElement", "fetch"],
        undef: true,
        unused: true
      },
      warnOnly: true
    }
  }
}
