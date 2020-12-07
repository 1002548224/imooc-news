
// 批量导出文件 
// require.context(directory, useSubdirectories, regExp)
// directory: 要查找的文件路径 ||
// useSubdirectories: 是否查找子目录 || regExp: 要匹配文件的正则
const requireApi = require.context(
	// api目录的相对路径
	'.',
	// 是否查询子目录
	false,
	// 查询文件的一个后缀
	/.js$/
)
let module = {}
requireApi.keys().forEach((key, index) => {
	if (key === './index.js') return
	console.log(key)
	// Object.assign() 浅拷贝
	// https://www.cnblogs.com/Z_66/p/12192431.html
	// Object.assign方法用户对象的合并，将源对象(source)的所有可枚举属性，复制到目标对象(target)
	// Object.assign(target, source1, source2)
	Object.assign(module, requireApi(key))
})
console.log(module)
// 导出module
export default module
