const createDOMPurify = require("dompurify")
const { JSDOM } = require("jsdom")

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)

function getFileDataUrl(file) {
    const fileBufferString = file.buffer.toString("base64")
    return `data:${file.mimetype};base64,${fileBufferString}`
}

const sanitizeDataUrl = (dataUrl) => {
    const regex = /^data:image\/(png|jpe?g);base64,/
    if (!regex.test(dataUrl)) {
        throw new Error("Invalid dataUrl format")
    }

    const sanitizedDataUrl = DOMPurify.sanitize(dataUrl)

    return sanitizedDataUrl
}

module.exports = { getFileDataUrl, sanitizeDataUrl }
