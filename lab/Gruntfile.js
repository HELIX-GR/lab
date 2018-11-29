module.exports = function (grunt) {

  const develop = process.env.NODE_ENV != 'production';

  // Project configuration

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sourceDir: 'src/main/frontend',

    buildDir: 'target/classes/static',

    targetDir: 'target/classes/public/',

    // Clean build directory
    clean: {
      options: {
        force: true,
      },
      'helix-lab': {
        src: ['<%= buildDir %>/*'],
      },
    },

    // Compile Sass files
    sass: {
      'helix-lab': {
        options: {
          style: develop ? 'expanded' : 'compressed',
        },
        files: {
          '<%= buildDir %>/css/style.css': ['<%= sourceDir %>/scss/main.scss'],
        },
      },
    },

    // Apply JavaScript lint rules
    eslint: {
      'helix-lab': {
        options: {
          configFile: develop ? '.eslintrc.develop.js' : '.eslintrc.js',
        },
        src: [
          '<%= sourceDir %>/js/**/*.js',
          '!<%= sourceDir %>/js/__tests__/**/*.js',
        ],
      },
    },

    // Transpile and bundle JavaScript files
    browserify: {
      options: {
        /* moved to package.json */
        watch: true,
      },
      'helix-lab': {
        options: {
          // Exclude the modules below from being packaged into the main JS file:
          // The following will be resolved globally (shim) or via earlier vendor includes
          external: [
            'fetch',
            'flat',
            'history',
            'immutable',
            'intl-messageformat',
            'lodash',
            'moment',
            'moment/locale/el',
            'prop-types',
            'react',
            'react-dom',
            'react-intl',
            'react-intl/locale-data/el',
            'react-intl/locale-data/en',
            'react-redux',
            'react-router-dom',
            'react-router-redux',
            'react-transition-group',
            'reactstrap',
            'redux',
            'redux-logger',
            'redux-thunk',
            'url-search-params',
          ]
        },
        files: {
          '<%= buildDir %>/js/bundle.js': ['<%= sourceDir %>/js/main.js'],
        },
      },
      'vendor-util': {
        options: {
          alias: [
            'isomorphic-fetch:fetch',
          ],
          require: [
            'flat',
            'history',
            'immutable',
            'intl-messageformat',
            'lodash',
            'moment',
            'moment/locale/el',
            'url-search-params',
          ],
        },
        files: {
          '<%= buildDir %>/js/vendor/util.js': []
        },
      },
      'vendor-react': {
        options: {
          alias: [
            'tether:reactstrap-tether',
          ],
          require: [
            'prop-types',
            'react',
            'react-dom',
            'react-intl',
            'react-intl/locale-data/el',
            'react-intl/locale-data/en',
            'react-redux',
            'react-router-dom',
            'react-router-redux',
            'react-transition-group',
            'reactstrap',
            'redux',
            'redux-logger',
            'redux-thunk',
            'url-search-params',
          ],
        },
        files: {
          '<%= buildDir %>/js/vendor/react-with-redux.js': [],
        },
      },
    },

    // Minify JavaScript files
    uglify: {
      options: {
        banner: '/*! Package: <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true,
        compress: {
          // Workaround for https://github.com/mishoo/UglifyJS2/issues/3274
          collapse_vars: false,
        },
      },
      'helix-lab': {
        files: {
          '<%= buildDir %>/js/bundle.min.js': ['<%= buildDir %>/js/bundle.js'],
        },
      },
      'vendor': {
        files: {
          '<%= buildDir %>/js/vendor/util.min.js': ['<%= buildDir %>/js/vendor/util.js'],
          '<%= buildDir %>/js/vendor/react-with-redux.min.js': ['<%= buildDir %>/js/vendor/react-with-redux.js'],
        },
      },
    },

    // Copy files to build folder
    copy: {
      options: {
        mode: '0644',
      },
      'helix-lab-scripts': {
        files: [{
          expand: true,
          filter: 'isFile',
          cwd: '<%= buildDir %>',
          src: 'js/helix-lab*.js',
          dest: '<%= targetDir %>',
        },],
      },
      'helix-lab-i18n-data': {
        files: [
          // Note i18n data are just copied verbatim to build/target directory
          {
            expand: true,
            filter: 'isFile',
            cwd: '<%= sourceDir %>/js',
            src: 'i18n/**/*.json',
            dest: '<%= targetDir %>',
          },
        ],
      },
      'helix-lab-stylesheets': {
        files: [{
          expand: true,
          filter: 'isFile',
          cwd: '<%= buildDir %>',
          src: 'css/*.css',
          dest: '<%= targetDir %>',
        },
        ],
      },
      'helix-lab-ol': {
        files: [{
          expand: true,
          filter: 'isFile',
          cwd: 'node_modules',
          src: 'ol/*.css',
          dest: '<%= targetDir %>/vendor',
        },
        ],
      },
      'helix-lab-fonts': {
        files: [
          {
            expand: true,
            cwd: 'node_modules/font-awesome/fonts/',
            src: '*',
            dest: '<%= targetDir %>/fonts',
          },
        ],
      },
      'vendor': {
        files: [{
          expand: true,
          filter: 'isFile',
          cwd: '<%= buildDir %>/',
          src: 'js/vendor/*.js',
          dest: '<%= targetDir %>',
        },],
      },
      'assets': {
        files: [{
          expand: true,
          filter: 'isFile',
          cwd: '<%= sourceDir %>/assets',
          src: ['**/*'],
          dest: '<%= targetDir %>',
        },],
      },
    },

    // Watch for file changes during development
    watch: {
      options: {
        interrupt: true
      },
      'helix-lab-assets': {
        files: ['<%= sourceDir %>/assets/**/*'],
        tasks: ['copy:assets'],
      },
      'helix-lab-i18n-data': {
        files: ['<%= sourceDir %>/js/i18n/**/*.json'],
        tasks: ['copy:helix-lab-i18n-data'],
      },
      'helix-lab-scripts': {
        files: ['<%= sourceDir %>/js/**/*.js'],
        tasks: ['copy:helix-lab-scripts'],
      },
      'helix-lab-stylesheets': {
        files: ['<%= sourceDir %>/scss/**/*.scss'],
        tasks: ['sass:helix-lab', 'copy:helix-lab-stylesheets'],
      },
    },

  });

  //
  // Load task modules
  //

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');

  //
  // Events
  //

  grunt.event.on('watch', function (action, filePath, target) {
    grunt.log.writeln(target + ': ' + filePath + ' has ' + action);
  });

  //
  // Tasks
  //

  grunt.registerTask('mode', function () {
    grunt.log.writeln('Building in [' + (process.env.NODE_ENV || 'development') + '] mode');
  });

  grunt.registerTask('browserify:vendor', [
    'browserify:vendor-util', 'browserify:vendor-react',
  ]);

  grunt.registerTask('build:helix-lab', develop ?
    ['sass:helix-lab', 'eslint:helix-lab', 'browserify:helix-lab',] :
    ['sass:helix-lab', 'eslint:helix-lab', 'browserify:helix-lab', 'uglify:helix-lab']);

  grunt.registerTask('build:vendor', develop ?
    ['browserify:vendor-util', 'browserify:vendor-react'] :
    ['browserify:vendor-util', 'browserify:vendor-react', 'uglify:vendor']);

  grunt.registerTask('build', ['build:helix-lab', 'build:vendor', 'copy:assets', 'copy:helix-lab-i18n-data', 'copy:helix-lab-fonts']);

  grunt.registerTask('develop', ['mode', 'clean', 'build', 'copy', 'watch']);

  grunt.registerTask('default', ['mode', 'clean', 'build', 'copy']);
};
