var qs = require('querystring');
var jsdom = require('jsdom');
var fs = require('fs');
var url = require('url');

exports.Video = function(videoUrl,callback){
	if(!videoUrl) {
		callback('网址为空','');
		return;
	}
	var resolve = url.parse(videoUrl);
	if(!resolve.hostname) {
		callback('视频网址不正确','');
		return;
	}
	var hosts = resolve.hostname.match(/youku.com|ku6.com|sohu.com|tudou.com$/i);
	if(hosts){
		var jquery = fs.readFileSync("./lib/jquery1.8.3.js").toString();
		jsdom.env({
			html:videoUrl,
			src:[jquery],
			done:function (errors, window) {
				if(errors) {
					callback('获取视频错误,请重试！','');
				}
				else{
			  		var $ = window.$;
			  		switch(hosts[0]) {
						case 'youku.com':
							var content = $("#s_baidu1").attr('href');
			    			var videoInfo = qs.parse(content);
			    			var flash = videoUrl.match(/id\_(\w+)\.html/);
			    			var rs = {flash:'http://player.youku.com/player.php/sid/'+flash[1]+'/v.swf',img:videoInfo.pic,weburl:videoUrl};
			    			callback('',rs);
							break;
						case 'ku6.com':
							var flash = $('.text_A').val();
							var pic = $('head').html().match(/cover.*?:.*?\"(.*?\.jpg)/i);
							var rs = {flash:flash,img:pic[1],weburl:videoUrl};
			    			callback('',rs);
							break;
						case 'tudou.com':
							var content = $('body').html();
							var flash = content.match(/,icode: "([^"]+)"/);
							var pic = content.match(/,pic: "([^"]+)"/);
							var rs = {flash:'http://www.tudou.com/v/'+flash[1],img:pic[1],weburl:videoUrl};
							callback('',rs);
							break;
						case 'sohu.com':
							var pic = $('head').html().match(/cover="([^"]+)";/);
							var flash = $('head').html().match(/vid=\"(.*?)\"/);
							var rs = {flash:'http://share.vrs.sohu.com/'+flash[1]+'/v.swf',img:pic[1],weburl:videoUrl};
							callback('',rs);
							break;
					}
				}
		    	window.close();
			}
		});
	}
	else {
		callback('暂不支持该视频地址','');
	}
};

