const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')
const newer = require('gulp-newer');
const gutil = require('gulp-util');
const path = require('path')
const serverEntrys = './src/server/**/*.js'

var paths = {
	src: {
		baseDir: 'src/server',
		jsFiles: 'src/server/**/*.js',
	},
	dist: {
		baseDir: 'dist/server',
	}
};

// js编译
async function jsCompile(){
  return gulp.src(paths.src.jsFiles)
          .pipe(newer(paths.dist.baseDir))
          .pipe(babel({
            plugins: ['@babel/plugin-transform-modules-commonjs']
          }))  
          .pipe(gulp.dest(paths.dist.baseDir))
}

function log() {
	var data = Array.prototype.slice.call(arguments);
	gutil.log.apply(false, data);
}

// 监听文件
async function watchHandler(){
  await gulp.watch(paths.src.jsFiles)
		.on('change', async function (file) {
      log(gutil.colors.yellow(file) + ' is changed');
      handlerFiles('changed', file);
    })
    .on('add', function (file) {
      log(gutil.colors.cyan(file) + ' is added');
      handlerFiles('add', file);
    })
    .on('unlink', function (file) {
      log(gutil.colors.red(file) + ' is deleted');
      handlerFiles('removed', file);
		});
}

//监听变化
function handlerFiles(type, file) {
	var extname = path.extname(file);
	if(extname === '.js'){
		if (type === 'removed') {
			deleteFile(file)
		} else {
			jsCompile()
		}
	}

};

function deleteFile(file){
  var tmp = file.replace(/\\/g,"/").replace(paths.src.baseDir, paths.dist.baseDir)
	del([tmp]);
}

// 清除dist文件
async function clean(){
	await del(['./dist/server/**']);
}


exports.dev = gulp.series(clean,jsCompile,watchHandler)
