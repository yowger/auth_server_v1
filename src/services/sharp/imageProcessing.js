const sharp = require("sharp")

const DEFAULT_OPTIONS = {
    width: 300,
    height: 300,
    fit: "cover",
    position: "center",
    quality: 80,
}

function resizeAndCompressImage(imageBuffer, options = {}) {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

    const compressedImage = sharp(imageBuffer)
        .resize({
            width: mergedOptions.width,
            height: mergedOptions.height,
            fit: mergedOptions.fit,
            position: mergedOptions.position,
        })
        .jpeg({ quality: mergedOptions.quality })
        .toBuffer()

    return compressedImage
}

module.exports = { resizeAndCompressImage }
