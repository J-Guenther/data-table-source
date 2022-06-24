module.exports = class DataTableSource {
    constructor(data) {
        this.data = data
        this._filteredData = this.data
    }

    get filteredData(){
        return this._filteredData
    }

    filter(filter) {
        this._filteredData = this.data.filter(dataObject => {
            const dataStr = Object.keys(dataObject).reduce((currentTerm, key) => {
                return currentTerm + dataObject[key] + '◬';
            }, '').toLowerCase()

            return dataStr.indexOf(filter.toLowerCase().trim()) !== -1
        })
    }
}
