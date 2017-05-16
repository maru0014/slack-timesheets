import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import mocha from 'gulp-mocha';

const compileFile = 'main.js';

gulp.task('dest', () => {
    browserify({
        entries: ['src/'+compileFile]
    })
    .transform('babelify')
    .plugin('gasify')
    .bundle()
    .pipe(source(compileFile))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', () => {
    gulp.src('test/**/*.js', {read: false})
    .pipe(mocha({
        reporter: 'spec',
        compilers: 'js:babel-core/register'
    }));
});

gulp.task('default', ['test', 'dest'], () => {});

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['dest']);
});
