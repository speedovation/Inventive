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
var nib = require('nib');
var autoprefixer = require('autoprefixer-stylus');

//Broswer reloading
var browserSync = require('browser-sync').create();

// define the default task and add the watch task to it
gulp.task('default', ['watch','serve'], function()
{
    gulp.watch("stylus");
    gulp.watch("jade");
    gulp.watch("coffee");
    gulp.watch("coffee-seperate");
});


gulp.task('stylus', function () {

    //var filter = Filter('**/*.styl');

    return gulp.src(
        [   
            './src/stylus/**/*.styl',
            '!./src/stylus/**/_*.styl'
        ], { base: 'src/stylus' }
        )
        .pipe(cached('build'))
        //.pipe(filter)
        .pipe(stylus())
        //.pipe(filter.restore())
        //.pipe(concat('base.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
        ;
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
        //.pipe(filter)
        .pipe(jade({pretty:true}))
        //.pipe(filter.restore())
        //.pipe(concat('base.css'))
        .pipe(gulp.dest('./build/html'))
        .pipe(browserSync.stream())
        ;
});


gulp.task('coffee-seperate', function () {
    return gulp.src(
        [   
            './src/coffeescript/*.coffee',
            '!./src/coffeescript/_*.coffee'
        ], { base: 'src/coffeescript' }
        )
            .pipe(coffee())
            .pipe(gulp.dest('./build/js/components'));

});

gulp.task('coffee', function () {

    //var filter = Filter('**/*.styl');

    return gulp.src(
        [   
            './src/coffeescript/*.coffee',
            '!./src/coffeescript/_*.coffee'
        ], { base: 'src/coffeescript' }
        )
            .pipe(cached('build'))
            //.pipe(filter)
            .pipe(coffee())
            //.pipe(filter.restore())
            .pipe(concat('inventive.js'))
            .pipe(gulp.dest('./build/js'))
            
        
});




// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
  gulp.watch('src/jade/*.jade', ['jade']);
  gulp.watch('src/coffee/*.coffee', ['coffee','coffee-seperate']);
});





// Static Server + watching stylus/html files
gulp.task('serve', ['stylus'], function() {

    browserSync.init({
        server: "./"
    });

    
    gulp.watch("build/html/*.html").on('change', browserSync.reload);
});














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
