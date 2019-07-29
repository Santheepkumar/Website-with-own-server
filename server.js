//Import
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

//Hostname and stuff

const hostname = '127.0.0.1';
const port = 5000;

//giving supported files for my server

const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',

};

//Ceating a server and extracting file name from url

http.createServer((req, res) => {
    var myuri = url.parse(req.url).pathname
    var filename = path.join(process.cwd(), unescape(myuri));
    console.log('File u r looking for is:' + filename);

    //Loading the file
    var loadfile;

    try {
        loadfile = fs.lstatSync(filename)
    } catch (error) {

        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.write('404 Page not found');
        res.end();
        return;

    }

    //comparing the file with our mimetypes for example html and css which we given up


    if (loadfile.isFile()) {
        var mimeType = mimeTypes[path.extname(filename).split('.').reverse()[0]];

        res.writeHead(200, {
            'Content-Type': mimeType
        });
        var filestream = fs.createReadStream(filename);
        filestream.pipe(res)
    } else if (loadfile.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();

    } else {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('500 Internal Error');
        res.end()
    }

}).listen(port, hostname, () => {
    console.log(`Server is running at port : ${port}`)
})