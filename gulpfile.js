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

//Broswer reloading
var browserSync = require('browser-sync').create();

// define the default task and add the watch task to it
gulp.task('default', ['watch','serve'], function()
{
    gulp.watch("stylus");
    gulp.watch("jade");
    gulp.watch("coffee");
    
    gulp.start('stylus-all')
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

    return gulp.src(
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
        .pipe(stylus({error: true, use: [nib()]}))
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
        .pipe(gulp.dest('./build/html'))
        .pipe(browserSync.stream())
        ;
});


gulp.task('coffee', function () {
   gulp.src(
        [   
            './src/coffeescript/*.coffee',
            '!./src/coffeescript/_*.coffee'
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




// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
  gulp.watch('src/jade/*.jade', ['jade']);
  gulp.watch('src/coffeescript/*.coffee', ['coffee']);
  
});





// Static Server + watching stylus/html files
gulp.task('serve', ['stylus','jade','coffee'], function() {

    browserSync.init({
        server: "./"
    });

    
    gulp.watch("build/css/**/*.css").on('change', browserSync.reload);
    gulp.watch("build/html/*.html").on('change', browserSync.reload);
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
