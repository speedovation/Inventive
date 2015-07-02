var gulp   = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var Filter = require('gulp-filter');
var lr = require('gulp-livereload');
var gif = require('gulp-if');
var cached = require('gulp-cached');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var nib = require('nib');
var autoprefixer = require('autoprefixer-stylus');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
var git = require('gulp-git');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var sourcemaps = require('gulp-sourcemaps');

var bump = require('gulp-bump');

//var autoprefixer = require('gulp-autoprefixer');


//Broswer reloading
var browserSync = require('browser-sync').create();

// define the default task and add the watch task to it
gulp.task('default', ['watch','serve', 'stylus','jade','coffee', 'vendors']);


gulp.task('stylus', function () {

   var processors = [
        autoprefixer({browsers: ['last 2 version']})
    ];

     gulp.src(
        [   
            './src/stylus/inventive.styl',
            './src/stylus/extra/doc.styl',
        ], { base: 'src/stylus' }
        )
        //.pipe(cached('build'))
        .pipe(plumber(swallowError))
        .pipe(stylus())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
        ;
        
    gulp.src([   
            './src/stylus/*.styl',
            './src/stylus/**/*.styl',
            '!./src/stylus/**/_*.styl'
        ], { base: 'src/stylus' })
        .pipe(plumber(swallowError))
        .pipe(stylus()) //{error: true, use: [nib()]}}
        .pipe(postcss(processors) ) 
        .pipe(gulp.dest('./build/css'))
        ;
        
        
    //TODO start using sourcemaps
     //.pipe(sourcemaps.init())
     //.pipe(autoprefixer())
     //.pipe(sourcemaps.write('.'))
     //.pipe(gulp.dest('./build/css/'));
      
      
      
});

gulp.task('jade', function () {

    return gulp.src(
        [   
            './src/jade/*.jade',
            '!./src/jade/_*.jade'
        ], { base: 'src/jade' }
        )
        .pipe(cached('build'))
        .pipe(plumber(swallowError))
        .pipe(jade({pretty:true}))
        .pipe(gulp.dest('./build/docs'))
        .pipe(browserSync.stream())
        ;
});


gulp.task('coffee', function () {
   
   return gulp.src([   
            './src/coffeescript/*.coffee',
            '!./src/coffeescript/_*.coffee',
            '!./src/coffeescript/doc.coffee'
            ], { base: 'src/coffeescript' }
           )
            .pipe(plumber(swallowError))
            .pipe(coffee({bare: true}))
            .pipe(gulp.dest('./build/js/components'))
            .pipe(concat('inventive.js'))
            .pipe(gulp.dest('./build/js'))
            .pipe(browserSync.stream())
            ;
        
});

gulp.task('vendors', function () {

    gulp.src([   
        "bower_components/jquery/dist/jquery.js",
        "build/js/components/doc.js",
        "bower_components/prism/prism.js"
    ])
    .pipe(plumber(swallowError))
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'))
    ;
    
    gulp.src([   
        "bower_components/prism/themes/prism.css",
        'build/css/extra/doc.css',
        'bower_components/inventive-font/fonts/stripe-font.css'
    ])
    .pipe(plumber(swallowError))
    .pipe(concat('vendors.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/css/'))
    ;

    gulp.src('bower_components/inventive-font/fonts/*.{ttf,woff,eof,svg}')
    .pipe(gulp.dest('./build/fonts'));

    gulp.src('src/img/**/*')
    .pipe(gulp.dest('./build/img'));
   
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
  gulp.watch('src/jade/*.jade', ['jade']);
  gulp.watch('src/coffeescript/*.coffee', ['coffee']);
  
});


// doc Server + watching stylus/html files
gulp.task('serve', ['stylus','jade','coffee'], function() {

    browserSync.init({
        server: "./build/"
    });
    
    gulp.watch("build/css/**/*.css").on('change', browserSync.reload);
    gulp.watch("build/docs/*.html").on('change', browserSync.reload);
    gulp.watch("build/js/*.js").on('change', browserSync.reload);
    
});


//Related to release and publish build

gulp.task('build', ['default']);

gulp.task('bump', ['build'], function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({version:'0.9.3'}))
  .pipe(gulp.dest('./'));
});

gulp.task('tag', ['bump'], function () {
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});

gulp.task('npm', ['tag'], function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('release', ['npm']);
gulp.task('ci', ['build']);

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}





//SAMPLE for learning Gulp ;)
// gulp.task('default', function(){
//   return gulp.src('src/**/*')
//     .pipe(cached('build'))
//     .pipe(gif('*.styl', stylus({
//       use:[
//         nib(),
//         autoprefixer()
//       ]
//     })))
//     .pipe(gif('*.js', uglify()))
//     .pipe(gulp.dest('dist'))
//     .pipe(lr());
// });

// gulp.watch('src/**/*', ['default']);
// configure the jshint task
// gulp.task('jshint', function() {
//   return gulp.src('source/javascript/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('jshint-stylish'));
// });
