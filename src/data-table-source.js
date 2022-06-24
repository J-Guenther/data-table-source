module.exports = class DataTableSource {
    constructor(data) {
        this.data = data
        this.filteredData = this.data
    }

    filter(filter) {
        this.filteredData = this.data.filter(dataObject => {
            const dataStr = Object.keys(dataObject).reduce((currentTerm, key) => {
                return currentTerm + dataObject[key] + '◬';
            }, '').toLowerCase()

            return dataStr.indexOf(filter.toLowerCase().trim()) !== -1
        })
    }
}
