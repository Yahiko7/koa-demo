const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')
const newer = require('gulp-newer');
const gutil = require('gulp-util');
const path = require('path')
const gulpif = require('gulp-if');
const rollup = require('gulp-rollup')
const replace = require('@rollup/plugin-replace')
const webpack = require('webpack-stream');
const shell = require('gulp-shell')

const isProd = process.env.NODE_ENV === 'development' ? false : true;

var paths = {
	src: {
		baseDir: 'src/server',
		jsFiles: 'src/server/**/*.js',
		cleanFiles: './src/server/config/index.js',
	},
	dist: {
		baseDir: 'dist/server',
	}
};

// 编译服务端js代码 es转commonjs
async function serverJsCompile(){
  await gulp.src(paths.src.jsFiles)
          .pipe(babel({
            plugins: [
						['@babel/plugin-proposal-decorators',{
							legacy: true
						}],
						'@babel/plugin-transform-modules-commonjs']
          }))  
          .pipe(gulp.dest(paths.dist.baseDir))
}

//对文件进行清洗 rollup
function cleanConfig() {
  return gulp.src(paths.src.jsFiles)
    .pipe(
      babel({
        plugins: [
				['@babel/plugin-proposal-decorators',{
					legacy: true
				}],'@babel/plugin-transform-modules-commonjs']
      })
    )
    .pipe(
      rollup({
				input: paths.src.cleanFiles,
				output: {
					format: 'cjs'
				},
				plugins: [replace({ 'process.env.NODE_ENV': "'production'" })]
      })
    )
    .pipe(gulp.dest(paths.dist.baseDir))
}

function log() {
	var data = Array.prototype.slice.call(arguments);
	gutil.log.apply(false, data);
}

// 监听服务端文件
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

function handlerFiles(type, file) {
	var extname = path.extname(file);
	if(extname === '.js'){
		if (type === 'removed') {
			deleteFile(file)
		} else {
			serverJsCompile()
		}
	}
};

function deleteFile(file){
  var tmp = file.replace(/\\/g,"/").replace(paths.src.baseDir, paths.dist.baseDir)
	del([tmp]);
}

// 清除dist文件
async function clean(){
	await del(['./dist/**']);
}

// 前端代码编译 webpack
async function clientDevCompile(){
	await gulp.src('src/web')
					.pipe(webpack( require('./config/webpack.dev.js') ))
					.pipe(gulp.dest('dist/web'));
}

async function clientProdCompile(){
	await gulp.src('src/web')
					.pipe(webpack( require('./config/webpack.prod.js') ))
					.pipe(gulp.dest('dist/web'));
}

async function start(){
	return gulp
    .src('*.js', { read: false })
    .pipe(shell(['node ./dist/server/bin/www']))
}

gulp.task('start', shell.task('node ./dist/server/bin/www'))

exports.dev = gulp.series(clean,gulp.parallel(serverJsCompile,clientDevCompile),watchHandler)
// exports.dev = gulp.series(clean,gulp.parallel(serverJsCompile),watchHandler)
exports.build = gulp.series(clean, gulp.parallel( gulp.series(serverJsCompile,cleanConfig),clientProdCompile))

exports.client = gulp.series(clean,clientDevCompile)