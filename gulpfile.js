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

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var sourcemaps = require('gulp-sourcemaps');

//var autoprefixer = require('gulp-autoprefixer');


//Broswer reloading
var browserSync = require('browser-sync').create();

// define the default task and add the watch task to it
gulp.task('default', ['watch','serve'], function()
{
    gulp.watch("stylus");
    gulp.watch("jade");
    gulp.watch("coffee");
    
    //gulp.start('stylus-all')
    gulp.start('vendors')
    gulp.start('copyfonts')
    //gulp.watch("serve");
});


gulp.task('stylus-all', function () {

    return gulp.src(
        [   
            './src/stylus/*.styl',
            './src/stylus/**/*.styl',
            '!./src/stylus/**/_*.styl'
        ], { base: 'src/stylus' }
        )
        .pipe(plumber(
        {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        
        ))
        .pipe(stylus({error: true, use: [nib()]}))
        .pipe(gulp.dest('./build/css'))
        ;
});


gulp.task('stylus', function () {

    //var filter = Filter('**/*.styl');
   
   var processors = [
        autoprefixer({browsers: ['last 1 version']})
    ];
   

     gulp.src(
        [   
            './src/stylus/inventive.styl',
            './src/stylus/extra/doc.styl',
            //'./src/stylus/*.styl',
            //'./src/stylus/**/*.styl',
            //'!./src/stylus/**/_*.styl'
        ], { base: 'src/stylus' }
        )
        //.pipe(cached('build'))
        //.pipe(filter)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        
         .pipe(stylus())
        //.pipe(filter.restore()) //,  {use: [nib()]}
        //.pipe(concat('base.css'))
         .pipe(postcss(processors))
         
         .pipe(gulp.dest('./build/css'))
         .pipe(browserSync.stream())
        ;
      
//         gulp.src('./build/css/inventive.css')
//         .pipe(sourcemaps.init())
         //.pipe(autoprefixer())
  //       .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('./build/css/'));
      
      
      
});

gulp.task('jade', function () {

    //var filter = Filter('**/*.styl');

    return gulp.src(
        [   
            './src/jade/*.jade',
            '!./src/jade/_*.jade'
        ], { base: 'src/jade' }
        )
        .pipe(cached('build'))
        .pipe(plumber(
        {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        
        ))
        //.pipe(filter)
        .pipe(jade({pretty:true}))
        //.pipe(filter.restore())
        //.pipe(concat('base.css'))
        .pipe(gulp.dest('./build/docs'))
        .pipe(browserSync.stream())
        ;
});


gulp.task('coffee', function () {
   gulp.src(
        [   
            './src/coffeescript/*.coffee',
            '!./src/coffeescript/_*.coffee',
            '!./src/coffeescript/doc.coffee',
            
        ], { base: 'src/coffeescript' }
        )
            //.pipe(cached('build'))
            //.pipe(filter)
            .pipe(plumber(
            {
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }
            
            ))
            .pipe(coffee().on('error', swallowError))
            //.pipe(filter.restore())
            .pipe(concat('inventive.js'))
            .pipe(gulp.dest('./build/js'))
/*            .pipe(browserSync.stream())*/
            ;
            
   
   gulp.src(
        [   
            './src/coffeescript/*.coffee',
            '!./src/coffeescript/_*.coffee'
        ], { base: 'src/coffeescript' }
        )
            .pipe(coffee({bare: true}).on('error', swallowError))
            .pipe(gulp.dest('./build/js/components'))
            .pipe(browserSync.stream())
            ;

    
            
        
});

gulp.task('vendors', function () {

      gulp.src(
        [   
            "bower_components/jquery/dist/jquery.js",
            "build/js/components/doc.js",
            "bower_components/prism/prism.js"
        ]
        )
        .pipe(plumber(
        {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        ))
		.pipe(concat('vendors.js'))
		.pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        ;
        
        gulp.src(
        [   
            "bower_components/prism/themes/prism.css",
            'build/css/extra/doc.css',
            'bower_components/inventive-font/fonts/stripe-font.css'

        ]
        )
        .pipe(plumber(
        {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        ))
        .pipe(concat('vendors.css'))
		.pipe(minifyCss())
        .pipe(gulp.dest('./build/css/'))
        ;
});

gulp.task('copyfonts', function() {
   
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
