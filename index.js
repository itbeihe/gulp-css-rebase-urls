var rework = require('rework');
var rurl = require('rework-plugin-url');
var path = require('path');
var through = require('through2');
var validator = require('validator');
var gutil = require('gulp-util');
var nulr = require('url');
var isAbsolute = function(p) {
    var normal = path.normalize(p);
    var absolute = path.resolve(p);
    return normal == absolute;
};

var sfiles = [];

var rebaseUrls = function(css, options,reworkConf) {
    return rework(css)
        .use(rurl(function(url){
            if ( validator.isURL(url)) {
                return url;
            }

            var absolutePath,relativePath,endPath;

            if(isAbsolute(url)){
                absolutePath = path.join(options.root, url);
            }else{
                absolutePath = path.join(options.currentDir, url);
            }
            // 获取静态文件相对根目录(gulpfile文件目录)的相对路径
            relativePath = path.relative(options.root, absolutePath);
            sfiles.push(relativePath);
            if(options.prefix){
                endPath = nulr.resolve(options.prefix,relativePath);
            }else{
                endPath = '/'+relativePath;
            }
            if (process.platform === 'win32') {
                endPath = endPath.replace(/\\/g, '/');
            }
            return endPath;
        }))
        .toString(reworkConf);
};

module.exports = function(options,callback) {
    options = options || {};
    return through.obj(function(file, enc, cb) {
        try{
            var css = rebaseUrls(file.contents.toString(), {
                currentDir: path.dirname(file.path),
                root: path.join(file.cwd, '.'),
                prefix:options.prefix
            },options);
            file.contents = new Buffer(css);
            this.push(file);
            cb();
        }catch(e){
            var err = new gutil.PluginError('gulp-css-rework-url', 'rework css file '+ file.path +' error');
            cb(err);
        }
    },function(cb){
        if(callback){
            callback(sfiles);
        }
        cb();
    });
};
