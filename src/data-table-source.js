/**
 * DataTableSource class for managing and filtering tabular data.
 * @class
 */
module.exports = class DataTableSource {

    #data
    #renderedData
    #filteredData
    #filter = ''
    #pageSize
    #currentPage = 1

    /**
     * Creates a new DataTableSource instance.
     * @constructor
     * @param {Array} data - The initial data array containing objects.
     * @param {number} [pageSize=0] - The number of items to display per page.
     * @throws Error - Will throw an error if the input data is not an array of objects or if objects in the array do not have uniform keys.
     */
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

    /**
     * Setter for the data property.
     * @param {Array} value - The new data array.
     */
    set data(value) {
        this.#data = value
        this.#render()
    }

    /**
     * Getter for the filter property.
     * @returns {string} - The current filter string.
     */
    get filter() {
        return this.#filter
    }

    /**
     * Setter for the filter property.
     * @param {string} value - The new filter string.
     */
    set filter(value) {
        this.#currentPage = 1
        this.#filter = value
        this.#render()
    }

    /**
     * Getter for the renderedData property.
     * @returns {Array} - The currently rendered data array based on filter, pageSize, and currentPage.
     */
    get renderedData() {
        return this.#renderedData
    }

    /**
     * Setter for the pageSize property.
     * @param {number} value - The new page size value.
     * @throws Error - Will throw an error if pageSize is not a number greater than or equal to 0.
     */
    set pageSize(value) {
        if (typeof value === 'number' && value >= 0) {
            this.#pageSize = value
            this.#render()
        } else {
            throw new Error('pageSize must be a number greater or equal 0')
        }
    }

    /**
     * Getter for the pageSize property.
     * @returns {number} - The current page size value.
     */
    get pageSize() {
        return this.#pageSize
    }

    /**
     * Setter for the currentPage property.
     * @param {number} value - The new current page value.
     * @throws Error - Will throw an error if currentPage is not a positive number.
     */
    set currentPage(value) {
        if (typeof value === 'number' && value > 0) {
            this.#currentPage = value
            this.#render()
        } else {
            throw new Error('currentPage must be a positive number')
        }
    }

    /**
     * Getter for the currentPage property.
     * @returns {number} - The current page number.
     */
    get currentPage() {
        return this.#currentPage
    }

    /**
     * Calculates the maximum number of pages based on the filtered data and page size.
     * @returns {number} - The maximum number of pages.
     */
    getMaxPages() {
        return this.#pageSize > 0 ? Math.ceil(this.#filteredData.length / this.#pageSize) : 1
    }

    /**
     * Moves to the next page if available.
     */
    nextPage() {
        if (this.#currentPage < this.getMaxPages()) {
            this.currentPage += 1;
        }
    }

    /**
     * Moves to the previous page if available.
     */
    previousPage() {
        if (this.#currentPage > 1) {
            this.currentPage -= 1;
        }
    }

    /**
     * Checks if the input array consists of objects.
     * @private
     * @param {Array} data - The input data array.
     * @returns {boolean} - True if all elements in the array are objects; otherwise, false.
     */
    #checkIfArrayConsistsOfObjects(data) {
        return !data.some((currentValue) => {
            return typeof currentValue !== 'object' || Array.isArray(currentValue) || !currentValue
        })
    }

    /**
     * Checks if objects in the input array have the same keys.
     * @private
     * @param {Array} data - The input data array.
     * @returns {boolean} - True if all objects have the same keys; otherwise, false.
     */
    #checkIfObjectsHaveSameKeys(data) {
        const firstObject = data[0]
        return data.every((currentValue) => {
            return JSON.stringify(Object.keys(firstObject).sort()) === JSON.stringify(Object.keys(currentValue).sort());
        })
    }

    /**
     * Filters the data based on the given filter string.
     * @private
     * @param {string} filter - The filter string.
     */
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

    /**
     * Renders the data based on filter, pageSize, and currentPage.
     * @private
     */
    #render() {
        this.#filterData(this.filter)

        const startIndex = (this.#currentPage - 1) * this.#pageSize;
        let endIndex = startIndex + this.#pageSize;
        if (endIndex <= 0) {
            endIndex = this.#filteredData.length;
        }

        this.#renderedData = this.#filteredData.slice(startIndex, endIndex);
    }

    /**
     * Resets the filter to an empty string.
     */
    resetFilter() {
        this.filter = ''
    }
}
