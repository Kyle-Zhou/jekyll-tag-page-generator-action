'use strict'

const testTag = { name: 'stock picks', slug: 'stock-picks', postcount: 6 }
const destination = 'C:\\Users\\hendr\\eclipse-workspace\\jekyll-tag-page-generator-action\\tags\\'

describe('good tests', () => {
	test('main()', () => {
		const generator = require('jekyll-tag-page-generator')

		//generator.main()
	}),
	test('getTags', () => {
		const generator = require('jekyll-tag-page-generator')

		generator.getTags('https://www.joehxblog.com/data/tags.json').then(tags => console.log(tags))
	}),
	test('getFileContents', () => {
		const generator = require('jekyll-tag-page-generator')

		let contents = generator.getFileContents(testTag)

		console.log(contents)
	}),
	test('writeFile', () => {
		const generator = require('jekyll-tag-page-generator')

		generator.writeFile(destination, testTag)
	})	,
	test('deleteUnused', () => {
		const generator = require('jekyll-tag-page-generator')

		new Promise(() => generator.deleteUnused(destination, [testTag]))
		        .catch(e => console.log(e))
	})
})
