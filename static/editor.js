

class QuoteEditor {
    constructor() {
        this.init()
    }
    init() {
        this.lightbox = document.querySelector("#lightbox")
        this.quoteText = document.querySelector("#new-quote-text")
        this.quoteAuthor = document.querySelector("#new-quote-author")
        this.quotesList = document.querySelector(".quotes-list")
        this.addButton = document.querySelector("#add-new-quote")
        this.isSaving = false

        document.addEventListener("keyup", e => {
            if (e.key === "e") this.showEditor()
        })

        document.querySelector("form").addEventListener("submit", e => {
            e.preventDefault()
            this.processNewQuote()
        })

    
    }

    showEditor = async () => {
        this.lightbox.classList.toggle("active")
        await this.reloadQuotesList()
    }
    reloadQuotesList = async () => {
        this.removeAllChildNodes(this.quotesList)

        const quotes = await this.getQuotes()
        for (const q of quotes) {
            const quoteHtml = this.getQUoteHtmlListItem(q)
            this.quotesList.appendChild(quoteHtml)
        }
    }

    getQUoteHtmlListItem = (quoteData) => {
        const html = `
            <div class="quote-list-item">
                ${quoteData.author}: ${quoteData.quote}
            </div>
            <div class="quote-list-item-delete">
                <a href="#" quote-id="${quoteData._id}">X</a>
            </div>
        `
        const li = document.createElement("li")

        li.classList.add("list-item")
        li.innerHTML = html

        li.querySelector("a").addEventListener("click", e => {
            e.preventDefault()
            this.deleteQuote(quoteData._id)
        })

        return li
    }

    getQuotes = async () => {
        try {
            const response = await fetch("/api/quotes")
            const data = await response.json()
            return data;
        } catch (error) {
            console.log(error);
        }
        return null
    }
 
    removeAllChildNodes(parent) {
        while(parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    processNewQuote = async () => {
        if (this.isSaving) return

        if (this.quoteText.value.length == 0 || this.quoteAuthor.value.length === 0) {
            console.log("Brak pelnych danych cytatu");
            return
        }

        this.isSaving = true
        if (this.addButton) this.addButton.disabled = true

        try {
            const response = await fetch("/api/quote/save", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quote: this.quoteText.value,
                    author: this.quoteAuthor.value
                })
            })

            if (!response.ok) {
                console.error('Server returned non-OK status', response.status)
                return
            }

            const data = await response.json()

            if(data && data.saved === true) {
                console.log("Nowy element zapisany w bazie z _id:", data._id)

                await this.reloadQuotesList()
                this.quoteText.value = ""
                this.quoteAuthor.value = ""
            } else {
                console.warn('Quote not saved on server')
            }
        } catch (err) {
            console.error('Error saving quote:', err)
        } finally {
            this.isSaving = false
            if (this.addButton) this.addButton.disabled = false
        }
    }

    deleteQuote = async (id) => {
        const response = await fetch("/api/quote/delete", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: id
                })
            })

        const data = await response.json()

        if(data && data.deleted === true ) {
            console.log("Skasowany element");
        }
        this.reloadQuotesList() 


    }

}

const quoteEditor = new QuoteEditor()