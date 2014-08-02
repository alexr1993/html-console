var http = require('http'),
    fs   = require('fs'),
    ua   = require('./useragent');

var mobile_html, desktop_html;

fs.readFile('index.html', function (err, data) {
    mobile_html = data;
});

fs.readFile('index_with_terminal.html', function (err, data) {
    desktop_html = data;
});

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html' });

    if (ua.isMobile( req.headers['user-agent']) ) {
        res.write(mobile_html);
        console.log("Mobile browser detected.");
    }
    else {
        res.write(desktop_html);
        console.log("Desktop browser detected.");
    }
    res.end();
}).listen(3000);

console.log("NodeJS HTTP server listening");
