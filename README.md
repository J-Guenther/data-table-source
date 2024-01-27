# DataTableSource

`DataTableSource` is a simple JavaScript class designed to manage and filter tabular data easily. It allows you to set data, apply filters, paginate through data, sort data, and retrieve the currently rendered dataset. It contains the JS logic you need for creating dynamic HTML tables. 

## Installation
`npm i data-table-source`

## Usage
```javascript
import DataTableSource from 'data-table-source';

const dataArray = [
    {name: 'Dragon Rider', album: 'Archangel', year: 2010, length: 1.53, composer: 'Thomas Bergersen'},
    {name: 'Fire Nation', album: 'Invincible', year: 2010, length: 2.59, composer: 'Nick Phoenix'},
    {name: 'Blackheart', album: 'SkyWorld', year: 2012, length: 4.32, composer: 'Thomas Bergersen'}
    // Add more data as needed
];

// Create an instance with initial data and optional page size
const dataTable = new DataTableSource(dataArray, pageSize);

// Set filters and paginate through data
dataTable.filter = 'berg';
dataTable.nextPage();

// Sort data by column name in ascending order
dataTable.sortData('name', 'asc')

// Reset sorting and filtering
dataTable.resetSorting()
dataTable.resetFilter()
```

## API
### Constructor

#### `new DataTableSource(data: Array, pageSize?: number): DataTableSource`

Creates a new DataTableSource instance.

- `data`: An array of objects representing the tabular data.
- `pageSize` (optional): The number of items to display per page.

Throws an error if the input data is not an array of objects or if objects in the array do not have uniform keys.

### Properties

#### data: Array

Setter for the data property.

```javascript
dataTable.data = newData;
```

#### filter: string

Getter and setter for the filter property.

```javascript
dataTable.filter = 'example';
console.log(dataTable.filter); // 'example'
```

#### renderedData: Array

Getter for the renderedData property, which returns the currently rendered data array based on filter, pageSize, and currentPage.

```javascript
console.log(dataTable.renderedData);
```

#### pageSize: number

Getter and setter for the pageSize property.
Set pageSize to 0 to deactivate it.

```javascript
dataTable.pageSize = 10;
console.log(dataTable.pageSize); // 10
```

#### currentPage: number

Getter and setter for the currentPage property.

```javascript
dataTable.currentPage = 2;
console.log(dataTable.currentPage); // 2
```

#### sortOrder: string

Getter for the current sort order. Can be 'asc' or 'desc'

Even if this has a value, data can be rendered unsorted. Actively call the sortData-Function to sort data.

```javascript
console.log(dataTable.sortOrder); // 'asc'
```

#### sortKey: string

Getter for the current sort key / column.

```javascript
console.log(dataTable.sortKey); // 'name'
```

### Methods

#### getMaxPages(): number

Calculates the maximum number of pages based on the filtered data and page size.

```javascript
const maxPages = dataTable.getMaxPages();
console.log(maxPages);
```

#### nextPage(): void

Moves to the next page if available.

```javascript
dataTable.nextPage();
```

#### previousPage(): void

Moves to the previous page if available.

```javascript
dataTable.previousPage();
```

#### resetFilter(): void

Resets the filter to an empty string.

```javascript
dataTable.resetFilter();
```

#### sortData(key: string, order?: string = 'asc'): void

Sorts the data array by key (column name) in ascending or descending order.

```javascript
dataTable.sortData('name', 'desc');
```

#### resetSorting(): void

Resets the sorting to display the data in its original order

```javascript
dataTable.resetSorting();
```

