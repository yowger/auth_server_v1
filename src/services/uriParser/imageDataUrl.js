const DatauriParser = require("datauri/parser")

const getImageDataUrl = (buffer, format) => {
    const parser = new DatauriParser()
    parser.format(format, buffer)
    const imageDataUrl = parser.content

    return imageDataUrl
}

module.exports = { getImageDataUrl }
