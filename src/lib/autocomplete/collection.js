import { delay, getJSON } from 'helpers'
import { Record } from 'lib/autocomplete/record'

export class Collection {
  static index = new Map()

  static async fetch(url, { expireIn = 60 * 1000 } = {}) {
    let collection = this.index.get(url)
    if (!collection) {
      collection = Collection.load(url)
      this.index.set(url, collection)
      delay(expireIn).then(() => this.index.delete(url))
    }
    return await collection
  }

  static async load(url) {
    return Collection.fromJSON(await getJSON(url))
  }

  static fromJSON(json) {
    return new Collection(json.map(Record.fromJSON))
  }

  constructor(records = [], { sort = false } = {}) {
    if (sort) records.sort(Record.compare)
    this.records = records
  }

  at(index) {
    return this.records[index]
  }

  map(fn) {
    return this.records.map(fn)
  }

  find(value) {
    return this.records.find((record) => record.value == value)
  }

  indexOf(value) {
    return this.records.findIndex((record) => record.value == value)
  }

  add(value) {
    const record = new Record([value])
    const { records } = new Collection(this.records.concat(record))
    this.records = records
    return record
  }

  without(...values) {
    const records = this.records.filter(
      (record) => !values.includes(record.value),
    )
    return new Collection(records, { sort: false })
  }

  first(limit) {
    const records = this.records.slice(0, limit)
    return new Collection(records, { sort: false })
  }

  search(query) {
    if (!query) return new Collection()
    const records = []
    for (const record of this.records) {
      const score = record.score(query)
      if (score) {
        records[score] || (records[score] = [])
        records[score].push(record)
      }
    }

    return new Collection(records.flat(), { sort: false })
  }

  get length() {
    return this.records.length
  }
}
