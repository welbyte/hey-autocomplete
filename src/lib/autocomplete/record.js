import { memoize, normalize } from 'lib/autocomplete/util'

export class Record {
  static fromJSON(json) {
    return new Record(json)
  }

  static compare(left, right) {
    return left.compare(right)
  }

  constructor([value, label, detail]) {
    this.value = value
    this.label = label || value
    this.detail = detail || value
  }

  compare(record) {
    return this.string.localeCompare(record.string)
  }

  score(query) {
    query = normalize(query)
    if (this.string == query) return 1
    if (this.string.startsWith(query)) return 2
    if (this.parts.some((part) => part == query)) return 3
    if (this.parts.some((part) => part.startsWith(query))) return 4
    if (this.string.includes(query)) return 5
  }

  get values() {
    return memoize(this, 'values', this.value.split(','))
  }

  get string() {
    return memoize(this, 'string', normalize(`${this.label} ${this.detail}`))
  }

  get parts() {
    return memoize(this, 'parts', this.string.split(/\s/))
  }
}
