module.exports = class DataTableSource {

    #data
    #renderedData
    #filteredData
    #filter = ''

    constructor(data) {
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
    }

    set data(value) {
        this.#data = value
        this.#render()
    }

    get filter(){
        return this.#filter
    }

    set filter(value){
        this.#filter = value
        this.#render()
    }

    get renderedData(){
        return this.#renderedData
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
                return currentTerm + dataObject[key] + '◬';
            }, '').toLowerCase()

            return dataStr.indexOf(filter.toLowerCase().trim()) !== -1
        })
    }

    #render() {
        this.#filterData(this.filter)
        this.#renderedData = this.#filteredData
    }

    resetFilter() {
        this.filter = ''
    }
}
