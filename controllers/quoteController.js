

const Quote = require("../model/quoteModel")

async function getQuotes() {
    try {
        const quotes = await Quote.getAll()
        return quotes
    } catch (error) {
        console.error(error);
        return null
    }
}

async function getQuote(id) {
    try {
        const quote = await Quote.getById(id)
        return quote
    } catch (error) {
        console.error(error);
        return null
    }
}

async function getRandom() {
    try {
        const quotes = await getQuotes()
        if (quotes) {
            return quotes[Math.floor(Math.random() * quotes.length)]
        } else {
            return null
        }
    } catch (error) {
        console.error(error);
        return null
    }
}

async function prepareDB () {
    try {
        const quotes = await getQuotes()

        if(!quotes) {
            const quotesArr = [
                {quote: "Knowing yourself is the beginning of all wisdom", author: "Aristotle"},
                {quote: "No great mind has ever exisated without a touch of madness", author: "Aristotle"},
                {quote: "Educating the mind without educating the heart is no education at all", author: "Aristotle"},
                {quote: "What is a friend?, Asingle soul dwelling in two bodies", author: "Aristotle"},
                {quote: "Hope is walking dream", author: "Aristotle"},
                {quote: "Happiness dependds upon ourselves", author: "Aristotle"},
                {quote: "A friend to all is a friend to none", author: "Aristotle"},
                {quote: "Wishing to be friends is quick work, but friendship is slow ripening fruit", author: "Aristotle"}
            ]

            await Quote.saveAll(quotesArr)
        }
    } catch (error) {
        console.error(error);
        return null
    }
}

async function deleteById(id) {
    try {
        const result = await Quote.deleteById(id)
        return result
    } catch (error) {
        console.log(error);
        return null
    }
}

async function updateById(id, quote) {
    try {
        const result = await Quote.updateById(id, quote)
        return result
    } catch (error) {
        console.log(error);
        return null
    }
}

async function insertQuote(quote) {
    try {
        const result = await Quote.insertQuote(quote)
        if (result && result.insertedId) {
            return result
        } else {
            return null
        }
    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports = {
    getQuote,
    getQuotes,
    getRandom,
    prepareDB,
    deleteById,
    updateById,
    insertQuote
}