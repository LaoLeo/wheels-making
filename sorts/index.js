function ArraySort() {
    /**
     *  冒泡排序
     * 
     * @param {*} array 
     */
    this.bubbleSort = function(array) {
        let l = array.length
        for (let i = 0; i < l; i++) {
            for (let j = 0; j < l - i - 1; j++) {
                if (array[j] > array[j + 1]) swap(array, j, j + 1)
            }
        }
    }

    /**
     * 选择排序
     * 
     * @param {array} array 
     */
    this.selectSort = function(array) {
        let l = array.length, minIndex
        for (let i = 0; i < l - 1; i++) {
            minIndex = i
            for (let j = i + 1; j < l; j++) {
                if (array[minIndex] > array[j]) minIndex = j
            }
            if (minIndex !== i) swap(array, i, minIndex)
        }
    }

    /**
     * 插入排序
     * 
     * @param {array} array 
     */
    this.insertSort = function(array) {
        console.time('insert sort')
        let l = array.length, temp, j
        for (let i = 1; i < l; i++) {
            temp = array[i]
            j = i
            while (j>0 && array[j-1] > temp) {
                array[j] = array[j-1]
                j--
            }
            array[j] = temp
        }
        console.timeEnd('insert sort')
    }

    /**
     * 归并排序
     * 
     * @param {*} array 
     */
    this.mergeSort = function(array) {
        return _mergeRec(array)

        function _mergeRec(array) {
            if (array.length === 1) return array
        
            let left, right, imid
            imid = Math.floor(array.length/2)
            left = array.slice(0, imid)
            right = array.slice(imid)
        
            return _merge(_mergeRec(left), _mergeRec(right))
        }
    
        function _merge(left, right) {
            let result = [], il = 0, ir = 0
            while (il < left.length && ir < right.length) {
                if (left[il] < right[ir]) {
                    result.push(left[il++])
                } else {
                    result.push(right[ir++])
                }
            }
        
            while (il < left.length) {
                result.push(left[il++])
            }
        
            while (ir < right.length) {
                result.push(right[ir++])
            }
            
            return result
        }
    }

    /**
     * 快速排序
     * 
     * @param {array} array 
     */
    this.quickSort = function(array) {
        _quick(array, 0, array.length-1)

        function _quick(array, left, right) {
            if (array.length < 2) return
    
            let index = _partition(array, left, right)
    
            if (left < index - 1) {
                _quick(array, left, index - 1)
            } 
            if (index < right){
                _quick(array, index, right)
            }
        }
    
        function _partition(array, left, right) {
            let pivot = array[Math.floor((left + right) / 2)]
    
            while (array[left] < pivot) {
                left++
            }
    
            while (array[right] > pivot) {
                right--
            }
    
            if (left <= right) {
                swap(array, left, right)
            }
    
            return ++left
        }
    }

    /**
     * 堆排序 根节点为最大值，然后将最大值至于数组尾部
     * 
     * @param {*} array 
     */
    this.heapSort = function(array) {
        let heapsize = array.length
        if (heapsize < 2) return

        // 构造堆，父节点总是大于子节点
        for(let i = Math.floor(heapsize / 2); i >= 0; i--) {
            _heapify(array, heapsize, i)
        }

        while (heapsize > 0) {
            heapsize--
            swap(array, 0, heapsize)
            _heapify(array, heapsize, 0)
        }

        function _heapify(array, heapsize, i) {
            let left, right, parenti
            left = i*2+1
            right = i*2+2
            largest = i
    
            if (left < heapsize && array[left] > array[largest]) {
                largest = left
            }
            if (right < heapsize && array[right] > array[largest]) {
                largest = right
            }
            
            if (largest !== i) {
                swap(array, largest, i)
                _heapify(array, heapsize, largest)
            }
        }
    }

    /**
     * Array.prototype.sort()的仿实现
     * 
     * @param {*} array 
     * @param {*} cFn 
     */
    this.defaultSort = function(array, cFn) {
        let _cFn
        if (cFn === undefined) {
            _cFn = _compareStringUnicode
        }else if (typeof cFn === 'function') {
            _cFn = cFn
        }else {
            throw new Error('compareFn must be a function')
        }
    
        _selectSort(array, _cFn)
        
        // 改写选择排序，传入判断条件
        function _selectSort(array, cFn) {
            let l = array.length, selectIndex
            for (let i = 0; i < l - 1; i++) {
                // 假设的最值下标
                selectIndex = i
                for (let j = i + 1; j < l; j++) {
                    if (cFn(array[selectIndex], array[j]) > 0) selectIndex = j
                }
                if (selectIndex !== i) swap(array, i, selectIndex)
            }
        }
        
        // 默认比较字符串的Unicode编码
        function _compareStringUnicode(a, b) {
            if(
                (typeof a !== 'string' && typeof a !== 'number' )||
                (typeof b !== 'string' && typeof b !== 'number')
            ) {
                throw new Error(`${a} / ${b} must be number or string`)
            }
    
            a = String(a)
            b = String(b)
            let l = a.length > b.length ? b.length : a.length
    
            for(let i=0; i<l; i++) {
                if(a.charCodeAt(i) === b.charCodeAt(i)) continue
    
                return a.charCodeAt(i) > b.charCodeAt(i)
            }
    
            return a.length > b.length ? true : false
        }
    }

    // 交换
    function swap(array, i, j) {
        [array[i], array[j]] = [array[j], array[i]]
    }
}

let test01 = [5, 4, 7, 1, 6, 3, 2]
let test02 = [5, 4, 7, 1, 6, 3, 2]
let test03 = [5, 4, 7, 1, 6, 3, 2]
let test04 = [5, 4, 7, 1, 6, 3, 2]
let test05 = [5, 4, 7, 1, 6, 3, 2]
let test06 = [5, 4, 7, 1, 6, 3, 2]
let test07 = [5, 4, 7, 1, 6, 3, 2]
let test08 = ['你好', '你们', '你走', '你']
let arraySort = new ArraySort()
arraySort.bubbleSort(test01)
arraySort.selectSort(test02)
arraySort.insertSort(test03)
let test04Sorted = arraySort.mergeSort(test04)
arraySort.quickSort(test05)
arraySort.heapSort(test06)
arraySort.defaultSort(test07)
arraySort.defaultSort(test08)
console.log(test01)
console.log(test02)
console.log(test03)
console.log(test04Sorted)
console.log(test05)
console.log(test06)
console.log(test07)
console.log(test08)