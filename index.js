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

const Readability = {
    VeryEasy: 'Very Easy',
    Easy: 'Easy',
    FairlyEasy: 'Fairly Easy',
    Standard: 'Standard',
    FairlyDifficult: 'Fairly Difficult',
    Difficult: 'Difficult',
    VeryDifficult: 'Very Difficult'
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
     * Returns true if the discovered language is included in `isoCodes`
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
        const data = {
            texts: [text1, text2]
        }
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
                    if (!response.hasOwnProperty('keywords') || !Array.isArray(response.keywords)) {
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
                    if (!response.hasOwnProperty('summary')) {
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
        text = this._normalizeText(text)
        const data = {
            text: text,
            target_lang: targetLang
        }

        if (sourceLang) {
            data.source_lang = sourceLang
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

    /**
     * Returns the readability and readability scores of the provided `text` written in `lang`
     * @param {string} text 
     * @param {string} lang 
     */
    readability (text, lang = 'en') {
        text = this._normalizeText(text)
        const data = {
            text: text,
            lang: lang
        }

        return new Promise((resolve, reject) => {
            this.client.request('text-readability', data)
                .then(response => {
                    if (!response.hasOwnProperty('score') || !response.hasOwnProperty('readability')) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response)
                })
                .catch(reject)
        })
    }

    /**
     * Returns a `Readability` value for the provided `text` written in `lang`
     *
     * @param {string} text
     * @param {string} lang
     */
    readabilityCategory (text, lang = 'en') {
        return this.readability(text, lang)
            .then(readability => readability.readability)
    }

    /**
     * Returns the readability score for the provided `text` written in `lang`
     *
     * @param {string} text
     * @param {string} lang
     */
    readabilityScore (text, lang = 'en') {
        return this.readability(text, lang)
            .then(readability => readability.score)
    }

    /**
     * Returns true if the readability of the provided `text` written in `lang` is in `readabilities`
     *
     * @param {string} text
     * @param {string} lang
     * @param {array} readabilities
     */
    readabilityIs (text, lang = 'en', readabilities = []) {
        return this.readabilityCategory(text, lang)
            .then(readability => readabilities.includes(readability))
    }

    /**
     * Returns true if the given `text` written in `lang` is considered as readable
     *
     * @param {string} text
     * @param {string} lang
     */
    isReadable (text, lang = 'en') {
        return this.readabilityIs(text, lang, [
            Readability.VeryEasy,
            Readability.Easy,
            Readability.FairlyEasy,
            Readability.Standard
        ])
    }

    /**
     * Returns true if the given `text` written in `lang` is considered as not readable
     *
     * @param {string} text
     * @param {string} lang
     */
    isNotReadable (text, lang = 'en') {
        return this.readabilityIs(text, lang, [
            Readability.VeryDifficult,
            Readability.Difficult,
            Readability.FairlyDifficult
        ])
    }

    /**
     * Generates an alt description for the given `imageUrl` written in `lang`
     *
     * @param {string} imageUrl
     * @param {string} lang
     */
    describeImage (imageUrl, lang = 'en') {
        const data = {
            image_url: imageUrl,
            lang: lang
        }

        return new Promise((resolve, reject) => {
            this.client.request('image-alt-detection', data)
                .then(response => {
                    if (!response.hasOwnProperty('alt') || !response.hasOwnProperty('confidence')) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response)
                })
                .catch(reject)
        })
    }

    /**
     * Returns the BERT Score for a given URL and Keyword.
     * 
     * BERT Score represents, from 0 to 100, how well the content of your URL
     * answers the user's search intent.
     *
     * @param {string} url
     * @param {string} keyword
     */
    bertScore (url, keyword) {
        const data = {
            url: url,
            keyword: keyword
        }

        return new Promise((resolve, reject) => {
            this.client.request('bert-score', data)
                .then(response => {
                    if (!response.hasOwnProperty('bert_score')) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response['bert_score'])
                })
                .catch(reject)
        })
    }

    /**
     * Returns the detected objects inside $imageUrl
     *
     * @param {string} imageUrl
     */
    recognizeObjects (imageUrl) {
        const data = {
            image_url: imageUrl
        }

        return new Promise((resolve, reject) => {
            this.client.request('image-object-recognition', data)
                .then(response => {
                    if (!response.hasOwnProperty('objects')) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response['objects'])
                })
                .catch(reject)
        })
    }

    /**
     * Runs a nudity detection analysis
     *
     * @param {string} imageUrl
     */
    nudityDetection (imageUrl) {
        const data = {
            image_url: imageUrl
        }

        return new Promise((resolve, reject) => {
            this.client.request('nudity-detection', data)
                .then(response => {
                    if (!response.hasOwnProperty('has_nudity')) {
                        return reject(new Error('Unknown error'))
                    }

                    resolve(response)
                })
                .catch(reject)
        })
    }

    /**
     * Checks if the given image contains nudity.
     *
     * @param {string} imageUrl
     */
    hasNudity (imageUrl) {
        return this.nudityDetection(imageUrl)
            .then(response => response.has_nudity)
    }

    /**
     * Returns the probability of the given image containing nudity.
     *
     * @param {string} imageUrl
     */
    nudityProbability (imageUrl) {
        return this.nudityDetection(imageUrl)
            .then(response => response.probability)
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
    Sentiment: Sentiment,
    Readability: Readability
}
