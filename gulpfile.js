var gulp = require( "gulp" ),
    less = require( "gulp-less" ),
    concat = require( "gulp-concat" ),
    minifycss = require( "gulp-minify-css" ),
    rename = require( "gulp-rename" ),
    connect = require( "gulp-connect" ),
    stylus = require( "gulp-stylus" ),
    gutil = require( "gulp-util" ),
    coffee = require( "gulp-coffee" ),
    coffeelint = require( "gulp-coffeelint" );

gulp.task("serve", function(){
    connect.server({
        root: "dist",
        livereload: true
    })
});

gulp.task("stylus",function(){
    gulp.src("src/stylus/*.styl")
        .pipe( stylus() )
        .pipe( gulp.dest("src/css") );
});

gulp.task( "less", function(){
    gulp.src( "src/less/*.less" )
        .pipe(less())
        .pipe(gulp.dest("src/css"))
});

gulp.task('html', function () {
  gulp.src('dist/*.html')
    .pipe(connect.reload());
});
gulp.task( "minicss",function(){
    gulp.src( "src/css/*.css" )
        .pipe(concat('main.css'))
        .pipe(gulp.dest("dist/css"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(gulp.dest("dist/css"))
        .pipe( connect.reload() );
});

gulp.task("validate_coffee",function(){
    gulp.src("src/coffee/*.coffee")
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
});

gulp.task("coffee",["validate_coffee"],function(){
    gulp.src("src/coffee/*.coffee")
        .pipe(coffee({ bare: true }).on('error', gutil.log))
        .pipe(gulp.dest("dist/js"))
        .pipe( connect.reload() );
});

gulp.task( "watch",function(){
    gulp.watch("scr/less/*.less", ["less"]);
    gulp.watch( "src/stylus/*.styl", ["stylus"] );
    gulp.watch( "src/css/*.css", ["minicss"]);
    gulp.watch(['dist/*.html'], ['html']);
    gulp.watch("src/coffee/*.coffee", ["coffee"]);
});

gulp.task("default",["watch","serve"])
