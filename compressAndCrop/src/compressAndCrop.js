var file, MAX_WIDTH = 300
let areaEl = document.querySelectorAll('.area-img')
let imgEl = document.querySelectorAll(".area-img img")
let figcaptionEl = document.querySelectorAll(".area-img figcaption")

let handler = {
    init(elem) {
        elem.ondragover = function (evt) {
            evt.preventDefault()

            elem.classList.add('active')
        }

        elem.ondragleave = function () {
            elem.classList.remove('active')
        }

        elem.ondrop = function (evt) {
            evt.preventDefault()
            elem.classList.remove('active')

            let file = evt.dataTransfer.files[0]
            if (file) {
                if (file.type.split('/')[0] !== 'image') return alert('文件不是图片类型')

                handler.readImgFile(file, imgEl[0]).then(img => {
                    handler.showImgInfo(figcaptionEl[0], areaEl[0], img.naturalWidth, img.naturalHeight, file.size)
                }).then(() => {
                    handler.compressAndPlant()
                })
            } else {
                file = window.file
                handler.compressAndPlant()
            }

        }
    },
    compressAndPlant() {
        let base64 = handler.compress(imgEl[0], {
            maxWidth: MAX_WIDTH,
            size: 100,
            // quality: 0.6,
            mineType: 'image/webp'
        })
        let blob = handler.base64ToBlob(base64)
        handler.readImgFile(blob, imgEl[1]).then(img => {
            handler.showImgInfo(figcaptionEl[1], areaEl[1], img.naturalWidth, img.naturalHeight, blob.size)
        })
    },
    selectImg(evt) {
        file = evt.target.files[0]
        handler.readImgFile(file, imgEl[0]).then(img => {
            handler.showImgInfo(figcaptionEl[0], areaEl[0], img.naturalWidth, img.naturalHeight, file.size)
        })
        areaEl[1].style.display = 'none'
    },
    /**
     * 
     * @param {*} imgEl 
     * @param {*} options { 
     *      maxWidth: 最大宽度,
            size: 最大size, 优先于quality
            quality: 压缩比,
            mineType: 图片类型
     *  }
     */
    compress(imgEl, options) {
        let cvs = document.createElement('canvas')
        let width = imgEl.naturalWidth
        let height = imgEl.naturalHeight
        let imgRatio = width / height
        // 计算压缩后的宽高
        if (width > options.maxWidth) {
            width = options.maxWidth
            height = width / imgRatio
        }
        if (height > options.maxWidth) {
            height = options.maxWidth
            width = height * imgRatio
        }
        cvs.width = width
        cvs.height = height

        let ctx = cvs.getContext('2d')
        ctx.drawImage(imgEl, 0, 0, imgEl.naturalWidth, imgEl.naturalHeight, 0, 0, width, height)

        let base64
        // 压缩指定size， 单位 kb
        if (options.size) {
            let quality = 0.9
            _c(quality)

            function _c(quality) {
                base64 = cvs.toDataURL(options.mineType, quality)
                if (Math.floor(base64.length / 1024) > options.size && quality > 0) {
                    quality -= 0.1
                    _c(quality)
                }  
            }
        } else {
            base64 = cvs.toDataURL(options.mineType, options.quality || 0.5)
        }

        return base64
    },
    readImgFile(file, imgEl) {
        return new Promise(resolve => {
            let url = window.URL.createObjectURL(file)
            imgEl.onload = function () {
                window.URL.revokeObjectURL(this.src)
                resolve(this)
            }
            imgEl.src = url
        })
    },
    showImgInfo(infoEl, areaEl, width, height, size) {
        infoEl.innerHTML = `<span>width/height:${width}/${height}</span><br>
            <span>size:${size}</span>`
        areaEl.style.display = 'block'
    },
    base64ToBlob(base64) {
        let base64Arr = base64.split(',')
        let base64String = base64Arr[1]
        let mineType = base64Arr[0].split(';')[0].split(':')

        // 将base64解码为二进制数据
        let bytes = window.atob(base64String)
        let length = bytes.length
        let bytesArray = new Uint8Array(length)
        for (let i = 0; i < length; i++) {
            bytesArray[i] = bytes.charCodeAt(i)
        }

        return new Blob([bytesArray], {type: mineType})
    }
}

handler.init(document.getElementById('uploadArea'))