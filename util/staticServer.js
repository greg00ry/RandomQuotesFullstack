
const fs = require("fs")
const path = require("path")
const url = require("url")

const mimeTypes = {
    ".html" : "text/html",
    ".js" : "text/application",
    ".css" : "text/css",
    ".jpg" : "image/jpg",
    ".png" : "imga/png"
}

function serveStaticFile (req, res) {
    const baseUrl = req.protocol + "://" + req.headers.host + "/"
    const parsedUrl = new URL(req.url, baseUrl)
    //console.log(parsedUrl)

    let pathSanitize = path.normalize(parsedUrl.pathname)
   // console.log(pathSanitize);
   // console.log("__dirnname: " + __dirname);
    
    let pathname = path.join(__dirname, "..","static", pathSanitize)
   // console.log(pathname);
    
    if (fs.existsSync(pathname)) {
        if(fs.statSync(pathname).isDirectory()) {
            pathname += "/index.html"
        }

        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500
                res.end("File not found" + err)
            } else {
                const extension = path.parse(pathname).ext

                res.setHeader("Content-type", mimeTypes[extension])
                res.end(data)
            }
        })
    } else {
        res.statusCode = 404
        res.end("File not found")
    }

}

module.exports = {
    serveStaticFile
}