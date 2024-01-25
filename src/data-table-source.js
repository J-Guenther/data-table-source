module.exports = class DataTableSource {

    #data
    #renderedData
    #filteredData
    #filter = ''
    #pageSize
    #currentPage = 1

    constructor(data, pageSize = 0) {
        if (!Array.isArray(data)) {
            throw new Error("Can not create DataTableSource. Input data needs to be an array of objects.")
        }
        if (data.length > 0) {
            if (!this.#checkIfArrayConsistsOfObjects(data)) {
                throw new Error("Can not create DataTableSource. Input data needs to be an array of objects.")
            }
            if (!this.#checkIfObjectsHaveSameKeys(data)) {
                throw new Error("Objects in data array do not have uniform keys")
            }
        }

        this.data = data
        this.pageSize = pageSize
    }

    set data(value) {
        this.#data = value
        this.#render()
    }

    get filter() {
        return this.#filter
    }

    set filter(value) {
        this.#currentPage = 1
        this.#filter = value
        this.#render()
    }

    get renderedData() {
        return this.#renderedData
    }

    set pageSize(value) {
        if (typeof value === 'number' && value >= 0) {
            this.#pageSize = value
            this.#render()
        } else {
            throw new Error('pageSize must be a number greater or equal 0')
        }
    }

    get pageSize() {
        return this.#pageSize
    }

    set currentPage(value) {
        if (typeof value === 'number' && value > 0) {
            this.#currentPage = value
            this.#render()
        } else {
            throw new Error('currentPage must be a positive number')
        }
    }

    get currentPage() {
        return this.#currentPage
    }

    getMaxPages() {
        return this.#pageSize > 0 ? Math.ceil(this.#filteredData.length / this.#pageSize) : 1
    }

    nextPage() {
        if (this.#currentPage < this.getMaxPages()) {
            this.currentPage += 1;
        }
    }

    previousPage() {
        if (this.#currentPage > 1) {
            this.currentPage -= 1;
        }
    }

    #checkIfArrayConsistsOfObjects(data) {
        return !data.some((currentValue) => {
            return typeof currentValue !== 'object' || Array.isArray(currentValue) || !currentValue
        })
    }

    #checkIfObjectsHaveSameKeys(data) {
        const firstObject = data[0]
        return data.every((currentValue) => {
            return JSON.stringify(Object.keys(firstObject).sort()) === JSON.stringify(Object.keys(currentValue).sort());
        })
    }

    #filterData(filter) {
        if (typeof filter === 'number') {
            filter = filter.toString()
        }
        this.#filteredData = this.#data.filter(dataObject => {
            const dataStr = Object.keys(dataObject).reduce((currentTerm, key) => {
                // The delimiter helps to prevent unintended matches that might occur if the property values are concatenated without any separation.
                return currentTerm + dataObject[key] + '(◕‿◕)';
            }, '').toLowerCase()

            return dataStr.indexOf(filter.toLowerCase().trim()) !== -1
        })
    }

    #render() {
        this.#filterData(this.filter)

        const startIndex = (this.#currentPage - 1) * this.#pageSize;
        let endIndex = startIndex + this.#pageSize;
        if (endIndex <= 0) {
            endIndex = this.#filteredData.length;
        }

        this.#renderedData = this.#filteredData.slice(startIndex, endIndex);
    }

    resetFilter() {
        this.filter = ''
    }
}
