let http = require('http');
let url = require('url');

function getClientAddress(req) {
	return (
		(req.headers['x-forwarded-for'] || '').split(',')[0] ||
		req.connection.remoteAddress
	);
}

function getClientLanguage(req) {
	const result = req.headers['accept-language'].split(',');
	return result[0];
}

function getOS(req) {
	let data = req.headers['user-agent'];
	data = data.split('(');
	let i = 0;
	let result = [];
	data[1] = data[1].split('');
	while (!data[1][i].includes(')')) {
		result.push(data[1][i]);
		i++;
	}
	return result.join('');
}

function formatResponse(req) {
	const ip = getClientAddress(req);
	const lang = getClientLanguage(req);
	const os = getOS(req);

	let response = {
		IP: ip,
		Language: lang,
		OS: os,
	};

	response = JSON.stringify(response);
	return response;
}

const server = http.createServer((req, res) => {
	const data = formatResponse(req);
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(data);
});

server.listen(3000);
server.on('error', function(e) {
	console.log(e);
});
