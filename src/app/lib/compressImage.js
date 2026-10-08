// Resizes a photo in the browser before upload: a 12-megapixel phone photo
// becomes a ~300 KB JPEG, so a dozen of them upload quickly on mobile data.
export function compressImage(file, maxDim = 1600, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width  = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      canvas.getContext("2d").drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Unreadable image")) }
    img.src = url
  })
}
