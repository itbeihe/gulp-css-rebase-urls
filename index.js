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

            var absolutePath;
            if(!isAbsolute(url)){
                absolutePath = path.join(options.root, url);

            }else{
                absolutePath = path.join(options.currentDir, url);

            }
            console.log('ap',absolutePath);
            var p = path.relative(options.root, absolutePath);
            var endPath = p;
            if(options.domain){
                endPath = nulr.resolve(options.domain,p);
                console.log('ep',endPath);
            }else{
                endPath = '/'+p;
            }
            if (process.platform === 'win32') {
                endPath = endPath.replace(/\\/g, '/');
            }
            sfiles.push(p);
            return endPath;
        }))
        .toString(reworkConf);
};

module.exports = function(options,callback) {
    options = options || {};
    var root = options.root || '.';

    return through.obj(function(file, enc, cb) {
        try{
            var css = rebaseUrls(file.contents.toString(), {
                currentDir: path.dirname(file.path),
                root: path.join(file.cwd, root),
                domain:options.domain
            },options);
            file.contents = new Buffer(css);
            this.push(file);
            cb();
        }catch(e){
            var err = new gutil.PluginError('gulp-rework', 'rework css file '+ file.path +' error');
            cb(err);
        }
    },function(cb){
        if(callback){
            callback(sfiles);
        }
        cb();
    });
};
