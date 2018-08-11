var file, MAX_WIDTH = 300
let areaEl = document.querySelectorAll('.area-img')
let imgEl = document.querySelectorAll(".area-img img")
let figcaptionEl = document.querySelectorAll(".area-img figcaption")

let handler = {
    init(elem) {
        elem.ondragover = function(evt) {
            evt.preventDefault()

            elem.classList.add('active')
        }

        elem.ondragleave = function() {
            elem.classList.remove('active')
        }

        elem.ondrop = function(evt) {
            evt.preventDefault()
            elem.classList.remove('active')

            let file = evt.dataTransfer.files[0]
            if (file) {
                if (file.type.split('/')[0] !== 'image') return alert('文件不是图片类型')
                
                handler.readImgFile(file, imgEl[0], function(img) {
                    handler.appendImg(figcaptionEl[0], areaEl[0], img.naturalWidth, img.naturalHeight, file.size)
                })

                handler.compress(imgEl[0], MAX_WIDTH, function(blob) {
                    handler.readImgFile(blob, imgEl[1], function(img) {
                        handler.appendImg(figcaptionEl[1], areaEl[1], img.naturalWidth, img.naturalHeight, blob.size)
                    })
                })

            } else {
                file = window.file
                handler.compress(imgEl[0], MAX_WIDTH, function(blob) {
                    handler.readImgFile(blob, imgEl[1], function(img) {
                        handler.appendImg(figcaptionEl[1], areaEl[1], img.naturalWidth, img.naturalHeight, blob.size)
                    })
                })
            }
        
        }
    },
    selectImg(evt) {
        file = evt.target.files[0]
        handler.readImgFile(file, imgEl[0], function(img) {
            handler.appendImg(figcaptionEl[0], areaEl[0], img.naturalWidth, img.naturalHeight, file.size)
        })
    },
    compress(imgEl, maxWidth, callback) {
        
        let cvs = document.createElement('canvas')
        let width = imgEl.naturalWidth
        let height = imgEl.naturalHeight
        let imgRatio = width / height
        // 计算压缩后的宽高
        if (width > maxWidth) {
            width = maxWidth
            height = width / imgRatio
        }
        if (height > maxWidth) {
            height = maxWidth 
            width = height * imgRatio
        }
        cvs.width = width
        cvs.height = height

        let ctx = cvs.getContext('2d')
        ctx.drawImage(imgEl, 0, 0, imgEl.naturalWidth, imgEl.naturalHeight, 0, 0, width, height)
        let quality = imgEl.naturalWidth >= maxWidth ? 0.5 : 1
        cvs.toBlob(function (blob) {
            callback(blob)
        }, 'image/webp', quality)

        // 返回base64
        // let base64 = cvs.toDataURL('image/webp', quality)
        // return base64
    },
    readImgFile(file, imgEl, callback) {
        let url = window.URL.createObjectURL(file)
        imgEl.onload = function() {
            window.URL.revokeObjectURL(this.src)
            callback(this)
        }
        imgEl.src = url
    },
    appendImg(infoEl, areaEl, width, height, size) {
        infoEl.innerHTML = `<span>width/height:${width}/${height}</span><br>
            <span>size:${size}</span>`
        areaEl.style.display = 'block'
    }
}

handler.init(document.getElementById('uploadArea'))