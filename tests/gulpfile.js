var gulp = require('gulp'),
    gutil = require('gulp-util'),
    cru = require('../index.js'),
    rename = require('gulp-rename');


gulp.task('test1',function(){
    gulp.src('./style/test.css')
        .pipe(cru({},function(files){
        })).pipe(rename('test1.css'))
        .pipe(gulp.dest('./style/')).on('end',function(){
            gutil.log('exec css1 end！');
        })
});

gulp.task('test2',function(){
    gulp.src('./style/test.css')
        .pipe(cru({
            prefix:'http://test.com/'
        },function(files){
            // 取出css中间的使用的静态文件
            //console.log(files);
            //sfiles = files;
        })).pipe(rename('test2.css'))
        .pipe(gulp.dest('./style/')).on('end',function(){
            gutil.log('exec css2 end！');
        })
});


gulp.task('test3',function(){
    gulp.src('./style/test.css')
        .pipe(cru({
            prefix:'http://test.com/build/'
        },function(files){
            // 取出css中间的使用的静态文件
            //console.log(files);
            //sfiles = files;
        })).pipe(rename('test3.css'))
        .pipe(gulp.dest('./style/')).on('end',function(){
            gutil.log('exec css3 end！');
        })
});

gulp.task('default',['test1','test2','test3']);