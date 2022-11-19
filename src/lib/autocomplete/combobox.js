import { Collection } from 'lib/autocomplete/collection'
import { Selection } from 'lib/autocomplete/selection'
import { List } from 'lib/autocomplete/list'
import { Input } from 'lib/autocomplete/input'

export class Combobox {
  static fromController({
    element,
    selectTarget,
    inputTarget,
    listTarget,
    urlValue,
  }) {
    const combobox = new Combobox(
      element,
      selectTarget,
      inputTarget,
      listTarget,
    )
    Collection.fetch(urlValue).then(combobox.setCollection)
    return combobox
  }

  constructor(element, selectElement, inputElement, listElement) {
    this.element = element
    this.collection = new Collection()
    this.selection = new Selection(this, selectElement)
    this.list = new List(this, listElement)
    this.input = new Input(this, inputElement)
  }

  connect() {
    this.notifyComponents('connect')
  }

  disconnect() {
    this.notifyComponents('disconnect')
  }

  notifyComponents(message, ...args) {
    const components = [this.selection, this.list, this.input]
    for (const component of components) component[message]?.(...args)
  }

  setCollection = (collection) => {
    this.collection = collection
    this.update()
  }

  update() {
    this.list.setCollection(
      this.collection
        .without(...this.selection.values)
        .search(this.input.value)
        .first(20),
    )
    this.toggle(this.list.length)
  }

  commit() {
    return this.list.record?.values.every((value) => this.add(value))
  }

  add(value, label) {
    const record = this.collection.find(value)
    if (record) label = record.label
    return this.selection.add(value, label)
  }

  remove(value) {
    console.log('REMOVE', value)
    return this.selection.remove(value)
  }

  removeLast() {
    return this.selection.removeLast()
  }

  toggle(force) {
    this.element.setAttribute('aria-expanded', !!force)
  }

  collapse() {
    this.toggle(false)
    this.list.resetCollection()
  }

  get index() {
    return this.list.index
  }

  set index(index) {
    return (this.list.index = index)
  }

  get value() {
    return this.list.value
  }

  set value(value) {
    return (this.list.value = value)
  }
}
