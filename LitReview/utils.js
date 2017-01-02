var yql_url = "https://query.yahooapis.com/v1/public/yql";

function corsGET(url, userCallback = function(response) {console.log(response);}) {
	$.ajax({
		'url': yql_url,
		'data': {
			'q': 'SELECT * FROM json WHERE url="' + url + '"',
			'format': 'json',
			'jsonCompat': 'new'
		},
		'dataType': 'jsonp',
		'success': userCallback
	});
}