/**
 * DataTableSource class for managing and filtering tabular data.
 * @class
 */
module.exports = class DataTableSource {

    #_data
    #_renderedData
    #_filteredData
    #_filter = ''
    #_pageSize
    #_currentPage = 1
    #_sortOrder = 'asc'
    #_sortKey = ''

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
        this.#_data = value
        this.#_filteredData = this.#_data
        this.#render()
    }

    /**
     * Getter for the filter property.
     * @returns {string} - The current filter string.
     */
    get filter() {
        return this.#_filter
    }

    /**
     * Setter for the filter property.
     * @param {string | number} value - The new filter string.
     */
    set filter(value) {
        this.#_currentPage = 1
        this.#_filter = value
        this.#filterData(this.#_filter)
        if (this.#_sortKey) {
            this.sortData(this.#_sortKey, this.#_sortOrder)
        }
    }

    /**
     * Getter for the renderedData property.
     * @returns {Array} - The currently rendered data array based on filter, pageSize, and currentPage.
     */
    get renderedData() {
        return this.#_renderedData
    }

    /**
     * Setter for the pageSize property.
     * @param {number} value - The new page size value.
     * @throws Error - Will throw an error if pageSize is not a number greater than or equal to 0.
     */
    set pageSize(value) {
        if (typeof value === 'number' && value >= 0) {
            this.#_pageSize = value
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
        return this.#_pageSize
    }

    /**
     * Setter for the currentPage property.
     * @param {number} value - The new current page value.
     * @throws Error - Will throw an error if currentPage is not a positive number.
     */
    set currentPage(value) {
        if (typeof value === 'number' && value > 0) {
            this.#_currentPage = value
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
        return this.#_currentPage
    }

    /**
     * Getter for the sortOrder property.
     * @returns {string} - The current sorting order ('asc' for ascending, 'desc' for descending).
     */
    get sortOrder() {
        return this.#_sortOrder;
    }

    /**
     * Getter for the sortKey property.
     * @returns {string} - The current key used for sorting.
     */
    get sortKey() {
        return this.#_sortKey;
    }

    /**
     * Calculates the maximum number of pages based on the filtered data and page size.
     * @returns {number} - The maximum number of pages.
     */
    getMaxPages() {
        return this.#_pageSize > 0 ? Math.ceil(this.#_filteredData.length / this.#_pageSize) : 1
    }

    /**
     * Moves to the next page if available.
     */
    nextPage() {
        if (this.#_currentPage < this.getMaxPages()) {
            this.currentPage += 1;
        }
    }

    /**
     * Moves to the previous page if available.
     */
    previousPage() {
        if (this.#_currentPage > 1) {
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
        this.#_filteredData = this.#_data.filter(dataObject => {
            const dataStr = Object.keys(dataObject).reduce((currentTerm, key) => {
                // The delimiter helps to prevent unintended matches that might occur if the property values are concatenated without any separation.
                return currentTerm + dataObject[key] + '(◕‿◕)';
            }, '').toLowerCase()

            return dataStr.indexOf(filter.toLowerCase().trim()) !== -1
        })

        this.#render()
    }

    /**
     * Sorts the data based on a specified key and order.
     * @param {string} key - The key to sort by.
     * @param {'asc' | 'desc'} [order='asc'] - The sorting order ('asc' for ascending, 'desc' for descending).
     * @throws {Error} If the sorting order is not 'asc' or 'desc'.
     * @throws {Error} If the specified key does not exist in the data objects.
     */
    sortData(key, order = 'asc') {
        if (['asc', 'desc'].indexOf(order) === -1) {
            throw new Error('Invalid sorting order. Use "asc" for ascending or "desc" for descending.');
        }

        if (!this.#checkIfKeyExists(key)) {
            throw new Error(`Key "${key}" does not exist in the data objects.`);
        }

        this.#_filteredData = this.#_filteredData.slice().sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];

            if (valueA === valueB) {
                return 0;
            }

            if (order === 'asc') {
                return valueA < valueB ? -1 : 1;
            } else {
                return valueA > valueB ? -1 : 1;
            }
        });

        this.#_sortKey = key
        this.#_sortOrder = order

        this.#render();
    }

    /**
     * Checks if the specified key exists in all data objects.
     * @private
     * @param {string} key - The key to check for existence.
     * @returns {boolean} - True if the key exists in all data objects; otherwise, false.
     */
    #checkIfKeyExists(key) {
        return this.#_data.every(dataObject => key in dataObject);
    }

    /**
     * Renders the data based on filter, pageSize, and currentPage.
     * @private
     */
    #render() {

        // Apply Pagination
        const startIndex = (this.#_currentPage - 1) * this.#_pageSize;
        let endIndex = startIndex + this.#_pageSize;
        if (endIndex <= 0) {
            endIndex = this.#_filteredData.length;
        }

        this.#_renderedData = this.#_filteredData.slice(startIndex, endIndex);
    }

    /**
     * Resets the filter to an empty string.
     */
    resetFilter() {
        this.filter = ''
    }

    resetSorting() {
        this.#_sortOrder = ''
        this.#_sortKey = 'asc'
        this.#filterData(this.#_filter)
    }
}
