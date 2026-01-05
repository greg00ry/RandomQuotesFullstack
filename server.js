
const http = require("http") 
const {getQuotes, getQuote, getRandom, prepareDB, insertQuote, deleteById} = require("./controllers/quoteController")
const {serveStaticFile} = require("./util/staticServer")


const PORT = 8080
const API_CONTENT_TYPE = {"Content-Type" : "application/json"}

const server = http.createServer(async function(req, res) {
    console.log("request");
    prepareDB()
    
    if (req.url === "/api/quotes" && req.method === "GET") {
        let quotes = await getQuotes()

        if(quotes) {
            res.writeHead(200, API_CONTENT_TYPE)
        } else {
            res.writeHead(404, API_CONTENT_TYPE)
            quotes = {message: "Quotes not found"}
        }

        res.end(JSON.stringify(quotes))
    } else if (req.url === "/api/quotes/random" && req.method === "GET") {
        let quote = await getRandom() 
        console.log(quote);
        
        if(quote) {
            res.writeHead(200, API_CONTENT_TYPE)
        } else {
            res.writeHead(404, API_CONTENT_TYPE)
            quote = {message: "Quote not found"}
        }

        res.end(JSON.stringify(quote))
    } else if (req.url.match(/\/api\/quotes\/([0-9a-z]+)/)) {
        const id = req.url.split("/")[3]

        let quote = await getQuote(id)
        if( quote ) {
            res.writeHead(200, API_CONTENT_TYPE)
        } else {
            res.writeHead(404, API_CONTENT_TYPE)
            quote = {message: "QUOTE NOT FOUND"}
        }

        res.end(JSON.stringify(quote))
    } else if(req.url === "/api/quote/save" && req.method === "POST") {
        let data = ""

        req.on("data", function (chunk) {
            data += chunk
        })

        req.on("end", async function() {
            const quote = JSON.parse(data)
            
            let response = {}
            const result = await insertQuote(quote)

            if(result) {
                res.writeHead(200)
                response = {saved: true, _id: result.insertedId}
            } else {
                res.writeHead(404)
                response = {saved: false, _id: null}
            }

            res.end(JSON.stringify(response))
        })
    } else if ((req.url === "/api/quote/delete" || req.url === "/api/quotes/delete") && req.method === "POST") {
        let data = ""

        req.on("data", function (chunk) {
            data += chunk
        })

        req.on("end", async function() {
            const quote = JSON.parse(data)

            if (!quote || !quote._id) {
                res.writeHead(400, API_CONTENT_TYPE)
                res.end(JSON.stringify({message: "Wrong ID"}))
                return
            }

            let response = {}
            const result = await deleteById(quote._id)

            if (result && result.deletedCount > 0) {
                res.writeHead(200, API_CONTENT_TYPE)
                response = {deleted: true}
            } else {
                res.writeHead(404, API_CONTENT_TYPE)
                response = {deleted: false}
            }

            res.end(JSON.stringify(response))
        })
    } else if ((req.url === "/api/quotes/delete" || req.url === "/api/quote/delete") && req.method === "GET") {
        // Prevent browser default anchor navigation causing a noisy 404
        res.writeHead(200, API_CONTENT_TYPE)
        res.end(JSON.stringify({message: "Use POST to delete quotes"}))
    } else {
        serveStaticFile(req, res)
    }
})

server.listen(PORT)
