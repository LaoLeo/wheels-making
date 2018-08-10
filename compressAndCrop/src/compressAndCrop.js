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
            console.log(file)
        }
    }
}

handler.init(document.getElementById('uploadArea'))