const fetch = require('node-fetch')

const Language = {
    Spanish: 'es',
    English: 'en',
    German: 'de',
    French: 'fr',
    Portuguese: 'pt',
    Italian: 'it',
    Dutch: 'nl',
    Polish: 'pl',
    Russian: 'ru'
}

const Sentiment = {
    VeryPositive: 'Very positive',
    Positive: 'Positive',
    Neutral: 'Neutral',
    Negative: 'Negative',
    VeryNegative: 'Very negative'
}

class Client {
    constructor (apiKey) {
        this.apiKey = apiKey
        this.base = 'https://api.silverdiamond.io/v1/service/'
    }

    request (endpoint, data) {
        endpoint = endpoint.replace(/^\/+|\/+$/g, '')
        return new Promise((resolve, reject) => {
            fetch(this.base + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.apiKey
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.message || response.error) {
                        return reject(new Error(response.message || response.error))
                    }
                    resolve(response)
                })
                .catch(error => reject(error))
        })
    }
}

class SilverDiamond {

    /**
     * Initializes a Silver Diamond instance
     * @param {string} apiKey
     */
    constructor (apiKey) {
        if (!apiKey) {
            throw new Error('No API Key was provided')
        }

        this._apiKey = apiKey
        this.client = new Client(apiKey)
    }

    /**
     * Returns the iso code of the detected `text` language
     * @param {string} text
     */
    language (text) {
        text = this._normalizeText(text)

        return new Promise((resolve, reject) => {
            this.client.request('language-detection', {
                text: text
            })
                .then(response => {
                    if (!response.language) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response.language)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Returns true if the discovered language is included in `$isoCodes`
     *
     * @param {string} text
     * @param {string|array} isoCodes
     */
    languageIs (text, isoCodes) {
        if (typeof isoCodes === 'string') {
            isoCodes = [isoCodes]
        }

        if (!Array.isArray(isoCodes)) {
            throw new Error('ISO Codes must be a string or an array')
        }

        isoCodes = isoCodes.map(code => code.trim().toLowerCase())

        return new Promise((resolve, reject) => {
            this.language(text)
                .then(language => resolve(isoCodes.includes(language.toLowerCase())))
                .catch(error => reject(error))
        })
    }

    /**
     * Returns true if the discovered language is Spanish
     *
     * @param {string} text
     */
    languageIsSpanish (text) {
        return this.languageIs(text, [Language.Spanish])
    }

    /**
     * Returns true if the discovered language is English
     *
     * @param {string} text
     */
    languageIsEnglish (text) {
        return this.languageIs(text, [Language.English])
    }

    /**
     * Returns true if the discovered language is German
     *
     * @param {string} text
     */
    languageIsGerman (text) {
        return this.languageIs(text, [Language.German])
    }

    /**
     * Returns true if the discovered language is French
     *
     * @param {string} text
     */
    languageIsFrench (text) {
        return this.languageIs(text, [Language.French])
    }

    /**
     * Returns true if the discovered language is Portuguese
     *
     * @param {string} text
     */
    languageIsPortuguese (text) {
        return this.languageIs(text, [Language.Portuguese])
    }

    /**
     * Returns true if the discovered language is Italian
     *
     * @param {string} text
     */
    languageIsItalian (text) {
        return this.languageIs(text, [Language.Italian])
    }

    /**
     * Returns true if the discovered language is Dutch
     *
     * @param {string} text
     */
    languageIsDutch (text) {
        return this.languageIs(text, [Language.Dutch])
    }

    /**
     * Returns true if the discovered language is Polish
     *
     * @param {string} text
     */
    languageIsPolish (text) {
        return this.languageIs(text, [Language.Polish])
    }

    /**
     * Returns true if the discovered language is Russian
     *
     * @param {string} text
     */
    languageIsRussian (text) {
        return this.languageIs(text, [Language.Russian])
    }

    /**
     * Returns the overall sentiment detected in `text`
     *
     * @param {string} text
     */
    sentiment (text) {
        text = this._normalizeText(text)

        return new Promise((resolve, reject) => {
            this.client.request('sentiment-analysis', {
                text: text
            })
                .then(response => {
                    if (!response.sentiment) {
                        return reject(new Error('Unknown error'))
                    }
                    resolve(response.sentiment)
                })
                .catch(error => reject(error))
        })
    }


    /**
     * Returns true if the text sentiment is included in `sentiments`
     *
     * @param {string} text
     * @param {string|array} sentiments
     */
    sentimentIs (text, sentiments) {
        if (typeof sentiments === 'string') {
            sentiments = [sentiments]
        }

        if (!Array.isArray(sentiments)) {
            throw new Error('Sentiments must be a string or an array')
        }

        sentiments = sentiments.map(sentiment => sentiment.trim().toLowerCase())

        return new Promise((resolve, reject) => {
            this.sentiment(text)
                .then(sentiment => resolve(sentiments.includes(sentiment.toLowerCase())))
                .catch(error => reject(error))
        })
    }

    /**
     * Returns true if the text sentiment is classified as *Positive* or *Very positive*
     *
     * @param {string} text
     */
    sentimentIsPositive (text) {
        return this.sentimentIs(text, [Sentiment.Positive, Sentiment.VeryPositive])
    }

    /**
     * Returns true if the text sentiment is classified as *Neutral*
     *
     * @param {string} text
     */
    sentimentIsNeutral (text) {
        return this.sentimentIs(text, [Sentiment.Neutral])
    }

    /**
     * Returns true if the text sentiment is classified as *Negative* or *Very negative*
     *
     * @param {string} text
     */
    sentimentIsNegative (text) {
        return this.sentimentIs(text, [Sentiment.Negative, Sentiment.VeryNegative])
    }

    /**
     * Performs a spam detection API call and returns the response
     *
     * @param {string} text
     * @param {string} ip
     */
    spam (text, ip) {
        const data = { text: text }
        if (ip) {
            data.ip = ip
        }

        return new Promise((resolve, reject) => {
            this.client.request('spam-detection', data)
                .then(response => {
                    if (!response.hasOwnProperty('spam') || !response.hasOwnProperty('ham')) {
                        return reject('Unknown error')
                    }

                    resolve(response)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Returns true if the provided text [and the IP Address] are classified as SPAM
     *
     * @param {string} text
     * @param {string} ip
     */
    isSpam (text, ip) {
        return this.spam(text, ip)
            .then(response => !!response.spam)
    }

    /**
     * Returns true if the provided text [and the IP Address] are classified as HAM
     *
     * @param {string} text
     * @param {string} ip
     */
    isHam (text, ip) {
        return this.spam(text, ip)
            .then(response => !!response.ham)
    }

    /**
     * Returns the spam score of a certain text [and IP Address] between 0 and 10. Higher means more spam probability
     *
     * @param {string} text
     * @param {string} ip
     */
    spamScore (text, ip) {
        return this.spam(text, ip)
            .then(response => parseFloat(response.spamScore) || 0.0)
    }

    /**
     * Returns the similarity of two texts between 0 and 1. Higher means more similar
     *
     * @param {string} text1
     * @param {string} text2
     */
    similarity (text1, text2) {
        text1 = this._normalizeText(text1)
        text2 = this._normalizeText(text2)
        const data = { texts: [text1, text2] }
        return new Promise((resolve, reject) => {
            this.client.request('short-text-similarity', data)
                .then(response => {
                    if (!response.hasOwnProperty('similarity')) {
                        return reject(new Error('Unknown error'))
                    }
                    resolve(response.similarity)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Returns a list of keywords extracted from the text
     *
     * @param {string} text
     */
    textRankKeywords (text) {
        text = this._normalizeText(text)
        const data = { text: text }
        return new Promise((resolve, reject) => {
            this.client.request('text-rank-keywords', data)
                .then(response => {
                    if (!response.keywords || !Array.isArray(response.keywords)) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response.keywords)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Returns a list of keywords extracted from the text
     *
     * @param {string} text
     */
    textRankSummary (text) {
        text = this._normalizeText(text)
        const data = { text: text }
        return new Promise((resolve, reject) => {
            this.client.request('text-rank-summary', data)
                .then(response => {
                    if (!response.summary) {
                        return reject(new Error('Unknown error'))
                    }
                    resolve(response.summary)
                })
                .catch(error => reject(error))
        })
    }

    /**
     * Translates text into `targetLang`, optionally specifying `sourceLang`
     *
     * @param {string} text
     * @param {string} targetLang
     * @param {string} sourceLang
     */
    translate (text, targetLang, sourceLang) {
        text = this._normalizeText(text);
        const data = {
            text: text,
            target_lang: targetLang
        }

        if (sourceLang) {
            data.source_lang = sourceLang;
        }

        return new Promise((resolve, reject) => {
            this.client.request('translation', data)
                .then(response => {
                    if (!response.translation) {
                        return reject(new Error('Unknown error'))
                    }
                    resolve(response.translation)
                })
                .catch(error => reject(error))
        })
    }

    _normalizeText (text) {
        if (typeof text !== 'string') {
            throw new Error('Text must be a string')
        }

        text = text.trim()
        if (text.length === 0) {
            throw new Error('Text must not be empty')
        }

        return text
    }
}

module.exports = {
    Api: SilverDiamond,
    Language: Language,
    Sentiment: Sentiment
}