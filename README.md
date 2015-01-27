# gulp-css-rebase-urls
重构css中静态资源的相对地址为静态地址,并把相对路径提取出来

[![NPM version][npm-image]][npm-url]

## 安装

Install with npm

```
npm install gulp-css-rework-url --save-dev
```

## 示例

```javascript
var gulp = require('gulp');
var cssReworkUrls = require('gulp-css-rework-url');
var sfiles;
gulp.task('test1',function(){
    gulp.src('./test-1.css')
        .pipe(cru({
            prefix:'http://test.com/build/'       // 静态路径前缀,如"/build/","http://test.com"
        },function(files){
            // 取出css中间的使用的静态文件
            console.log(files);
            sfiles = files;
        })).pipe(gulp.dest('./style/')).on('end',function(){
            //  这里可以处理css中出现的图片,字体,如迁移位置.
            console.log(sfiles);
            gutil.log('exec css end！');
        })
});
```

## 可以来做啥

```
.
|-- css
|   -- deep
|      |-- path
|      |   `-- core.css
|      `-- style.css
|-- img
|   |-- a.jpg
|   |-- b.jpg
|   `-- deeper
|       `-- c.jpg
|-- build
    |-- css
    |   `-- main.css
    |-- img
    |   |-- a.jpg
    |   `-- deeper
    |       `-- c.jpg
```
main.css = core.css + style.css

在core.css
```
.core{
    background: url('/img/a.jpg') no-repeat top left;
}
```
在style.css
```
.style{
    background: url('../../img/deeper/c.jpg') no-repeat top left;
}
```
合并到main.css,把css路径改成
```
.core{
    background: url('/build/img/deeper/c.jpg') no-repeat top left;
}
.style{
    background: url('/build/img/deeper/c.jpg') no-repeat top left;
}
```
或者
```
.core{
    background: url('http://test.com/build/img/deeper/c.jpg') no-repeat top left;
}
.style{
    background: url('http://test.com/build/img/deeper/c.jpg') no-repeat top left;
}
```

[npm-url]: https://npmjs.org/package/gulp-css-rework-url
[npm-image]: http://img.shields.io/npm/v/gulp-css-rework-url.svg
