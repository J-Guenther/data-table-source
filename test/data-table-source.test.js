const chai = require('chai')
const DataTableSource = require("../src/data-table-source");

const expect = chai.expect;

let data;

before(() => {
    data = [
        {name: 'Dragon Rider', album: 'Archangel', year: 2010, length: 1.53, composer: 'Thomas Bergersen'},
        {name: 'Fire Nation', album: 'Invincible', year: 2010, length: 2.59, composer: 'Nick Phoenix'},
        {name: 'Blackheart', album: 'SkyWorld', year: 2012, length: 4.32, composer: 'Thomas Bergersen'},
        {name: 'Empire of Angles', album: 'Sun', year: 2015, length: 5.16, composer: 'Thomas Bergersen'},
        {name: 'Impossible', album: 'Unleashed', year: 2017, length: 8.54, composer: 'Thomas Bergersen'},
        {name: 'Battleborne', album: 'Battlecry', year: 2015, length: 5.08, composer: 'Nick Phoenix'},
        {name: 'Orion', album: 'Orion', year: 2019, length: 8.07, composer: 'Michal Cielecki'},
        {name: 'Shield of Love', album: 'Songs for Ukraine', year: 2022, length: 3.03, composer: 'Thomas Bergersen'},
        {
            name: 'One Million Voices',
            album: 'Humanity - Chapter IV',
            year: 2021,
            length: 8.53,
            composer: 'Thomas Bergersen'
        },
        {name: 'Nightwood', album: 'Colin Frake On Fire Mountain', year: 2014, length: 3.09, composer: 'Nick Phoenix'},
    ];
})

describe('DataTableSource constructor tests', function () {

    it('should create a DataTableSource', function () {
        const dataTableSource = new DataTableSource(data)
        expect(dataTableSource).to.be.instanceof(DataTableSource)
    });

    it('should throw an error when Input Objects have different keys', function () {
        expect(() => new DataTableSource([{
            name: 'Dragon Rider',
            album: 'Archangel',
            year: 2010,
            length: 1.53,
            composer: 'Thomas Bergersen'
        },
            {name: 'Fire Nation', album: 'Invincible', year: 2010, length: 2.59, composer: 'Nick Phoenix'},
            {name: 'Blackheart', album: 'SkyWorld', year: 2012, length: 4.32, singer: 'Merethe Soltvedt'}])
        ).to.throw('Objects in data array do not have uniform keys')
    });

    it('should not create DataTableSource when input is no array', function () {
        expect(() => new DataTableSource(1337)
        ).to.throw('Can not create DataTableSource. Input data needs to be an array of objects.')
    });

    it('should not create DataTableSource when input is no array of objects', function () {
        expect(() => new DataTableSource([1337, 1234, 4321])
        ).to.throw('Can not create DataTableSource. Input data needs to be an array of objects.')
    });
})


describe('DataTableSource filter tests', function () {

    it('should filter data by string', function () {
        const dataTableSource = new DataTableSource(data)
        dataTableSource.filter = "Cie"
        expect(dataTableSource.renderedData).eql([{
            name: 'Orion',
            album: 'Orion',
            year: 2019,
            length: 8.07,
            composer: 'Michal Cielecki'
        }])
    });

    it('should not be case-sensitive', function () {
        const dataTableSource = new DataTableSource(data)
        dataTableSource.filter = "bAtTlEbOrNe"
        expect(dataTableSource.renderedData).eql([{
            name: 'Battleborne',
            album: 'Battlecry',
            year: 2015,
            length: 5.08,
            composer: 'Nick Phoenix'
        }])
    });

    it('should filter data by int number', function () {
        const dataTableSource = new DataTableSource(data)
        dataTableSource.filter = 2010
        expect(dataTableSource.renderedData).eql(
            [
                {name: 'Dragon Rider', album: 'Archangel', year: 2010, length: 1.53, composer: 'Thomas Bergersen'},
                {name: 'Fire Nation', album: 'Invincible', year: 2010, length: 2.59, composer: 'Nick Phoenix'}
            ]
        )
    });

    it('should filter data by float number', function () {
        const dataTableSource = new DataTableSource(data)
        dataTableSource.filter = 4.32
        expect(dataTableSource.renderedData).eql(
            [
                {name: 'Blackheart', album: 'SkyWorld', year: 2012, length: 4.32, composer: 'Thomas Bergersen'}
            ]
        )
    });

    it('should reset filter', function () {
        const dataTableSource = new DataTableSource(data)
        dataTableSource.filter = 'Bergersen'
        dataTableSource.resetFilter()
        expect(dataTableSource.renderedData).eql(data)
    });

});


describe('DataTableSource pagination tests', function () {

    it('should display data with page size 5', function () {
        const dataTableSource = new DataTableSource(data,  5)
        expect(dataTableSource.renderedData).eql([{name: 'Dragon Rider', album: 'Archangel', year: 2010, length: 1.53, composer: 'Thomas Bergersen'},
            {name: 'Fire Nation', album: 'Invincible', year: 2010, length: 2.59, composer: 'Nick Phoenix'},
            {name: 'Blackheart', album: 'SkyWorld', year: 2012, length: 4.32, composer: 'Thomas Bergersen'},
            {name: 'Empire of Angles', album: 'Sun', year: 2015, length: 5.16, composer: 'Thomas Bergersen'},
            {name: 'Impossible', album: 'Unleashed', year: 2017, length: 8.54, composer: 'Thomas Bergersen'}])
    });

    it('should get pageSize', function () {
        const dataTableSource = new DataTableSource(data,  1337)
        expect(dataTableSource.pageSize).eql(1337)
    });

    it('should initialize currentPage to 1', function () {
        const dataTableSource = new DataTableSource(data,  1337)
        expect(dataTableSource.currentPage).eql(1)
    });

    it('should display all data if pageSize is 0', function () {
        const dataTableSource = new DataTableSource(data,  0)
        expect(dataTableSource.renderedData).eql(data)
    });

    it('should throw an error if set pageSize is invalid', function () {
        const dataTableSource = new DataTableSource(data)
        expect(() => dataTableSource.pageSize = -1
        ).to.throw('pageSize must be a number greater or equal 0')

        expect(() => dataTableSource.pageSize = 'Trondheim'
        ).to.throw('pageSize must be a number greater or equal 0')
    });

    it('should display the second page', function () {
        const dataTableSource = new DataTableSource(data,  5)
        dataTableSource.currentPage = 2
        expect(dataTableSource.renderedData).eql([{name: 'Battleborne', album: 'Battlecry', year: 2015, length: 5.08, composer: 'Nick Phoenix'},
            {name: 'Orion', album: 'Orion', year: 2019, length: 8.07, composer: 'Michal Cielecki'},
            {name: 'Shield of Love', album: 'Songs for Ukraine', year: 2022, length: 3.03, composer: 'Thomas Bergersen'},
            {
                name: 'One Million Voices',
                album: 'Humanity - Chapter IV',
                year: 2021,
                length: 8.53,
                composer: 'Thomas Bergersen'
            },
            {name: 'Nightwood', album: 'Colin Frake On Fire Mountain', year: 2014, length: 3.09, composer: 'Nick Phoenix'}])
    });

    it('should throw an error if currentPage is invalid', function () {
        const dataTableSource = new DataTableSource(data)
        expect(() => dataTableSource.currentPage = -1
        ).to.throw('currentPage must be a positive number')

        expect(() => dataTableSource.currentPage = 0
        ).to.throw('currentPage must be a positive number')

        expect(() => dataTableSource.currentPage = 'Trondheim'
        ).to.throw('currentPage must be a positive number')
    });

    it('should get the correct maxPageSize', function () {
        const dataTableSource = new DataTableSource(data,  3)
        expect(dataTableSource.getMaxPages()).eql(4)
        dataTableSource.pageSize = 0
        expect(dataTableSource.getMaxPages()).eql(1)
    });

    it('should go to the next page', function () {
        const dataTableSource = new DataTableSource(data,  3)
        dataTableSource.nextPage()
        dataTableSource.nextPage()
        dataTableSource.nextPage()
        expect(dataTableSource.currentPage).eql(4)
        expect(dataTableSource.renderedData).eql([{name: 'Nightwood', album: 'Colin Frake On Fire Mountain', year: 2014, length: 3.09, composer: 'Nick Phoenix'}])
    });

    it('should go to the first page', function () {
        const dataTableSource = new DataTableSource(data,  3)
        dataTableSource.currentPage = 4
        dataTableSource.previousPage()
        dataTableSource.previousPage()
        dataTableSource.previousPage()
        expect(dataTableSource.currentPage).eql(1)
        expect(dataTableSource.renderedData).eql([ {name: 'Dragon Rider', album: 'Archangel', year: 2010, length: 1.53, composer: 'Thomas Bergersen'},
            {name: 'Fire Nation', album: 'Invincible', year: 2010, length: 2.59, composer: 'Nick Phoenix'},
            {name: 'Blackheart', album: 'SkyWorld', year: 2012, length: 4.32, composer: 'Thomas Bergersen'}])
    });

    it('should not go exceed maxPage when calling nextPage()', function () {
        const dataTableSource = new DataTableSource(data,  5)
        dataTableSource.nextPage()
        dataTableSource.nextPage()
        dataTableSource.nextPage()
        expect(dataTableSource.currentPage).eql(dataTableSource.getMaxPages())
    });

    it('should not go below 1 when calling previousPage()', function () {
        const dataTableSource = new DataTableSource(data,  5)
        dataTableSource.previousPage()
        expect(dataTableSource.currentPage).eql(1)
    });

    it('should reset Pagination when filter is used', function () {
        const dataTableSource = new DataTableSource(data,  3)
        dataTableSource.nextPage()
        dataTableSource.nextPage()
        expect(dataTableSource.currentPage).eql(3)
        dataTableSource.filter = 'Nightwood'
        expect(dataTableSource.currentPage).eql(1)
        expect(dataTableSource.getMaxPages()).eql(1)
        expect(dataTableSource.renderedData).eql([{name: 'Nightwood', album: 'Colin Frake On Fire Mountain', year: 2014, length: 3.09, composer: 'Nick Phoenix'}])
    });

    it('should reset Pagination when filter is used and filter is reset', function () {
        const dataTableSource = new DataTableSource(data,  3)
        dataTableSource.nextPage()
        dataTableSource.nextPage()
        expect(dataTableSource.currentPage).eql(3)
        dataTableSource.filter = 'thomas'
        expect(dataTableSource.currentPage).eql(1)
        expect(dataTableSource.getMaxPages()).eql(2)
        dataTableSource.nextPage()
        expect(dataTableSource.currentPage).eql(2)
        dataTableSource.resetFilter()
        expect(dataTableSource.currentPage).eql(1)
        expect(dataTableSource.getMaxPages()).eql(4)
    });
});
