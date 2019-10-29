const fs = require('fs');
const path = require('path');
const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const through = require('through2');
const imageSize = require('image-size');

// 路径 globs 配置
const paths = {
	styles: {
		src: 'src/scss/**/*.scss',
		dest: 'src/css/'
	},
	images: {
		src: 'src/img/**/*.{gif,jpg,jpeg,bmp,png}',
		dest: 'src/scss/_variables.scss'
	}
};

// 清除 build 目录
const clean = () => {
    return del(paths.styles.dest);
};

//  sass 编译
const styles = () => {
	return gulp.src(paths.styles.src)
	.pipe(sass({
		outputStyle: 'compact'
	}).on('error', sass.logError))
	.pipe(gulp.dest(paths.styles.dest));
};

// 读取图片尺寸，生成 _variables.scss 文件
const images = () => {
	const map = {};

	return gulp.src(paths.images.src).pipe(through.obj((file, enc, cb) => {
		const size = imageSize(file.path);
		const filename = path.basename(file.path, `.${ size.type }`);
		const keyWord = filename.toLowerCase();

		map[`${ keyWord }-width`] = size.width;
		map[`${ keyWord }-height`] = size.height;

		cb(null);
	})).on('finish', () => {
		let data = '';

		Object.keys(map).forEach(variable => {
			data += `$g-${ variable }: ${ map[variable] }px !default;\n`;
		});

		fs.writeFileSync(paths.images.dest, data, err => {
			if (err) throw err;
		});
	});
};

// watch 文件改变，重新编译
const watchFiles = () => {
	gulp.watch(paths.styles.src, gulp.series(clean, styles));
	gulp.watch(paths.images.src, gulp.series(clean, images, styles));
};

// 读取图片尺寸、编译 Sass，因为有依赖关系，所以使用串行方式
const compile = gulp.series(clean, images, styles);

gulp.task('watch', watchFiles);
gulp.task('default', compile);