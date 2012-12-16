var Video = require('./lib/embed').Video;

var video = Video('http://www.tudou.com/albumplay/XZcf_dbQDBQ/s5YtToSKHIY.html',function(error,result){
	console.log(result);
});