import { Collection } from 'lib/autocomplete/collection'
import { scrollIntoViewOptions } from 'lib/autocomplete/util'

let id = 0

export class List {
  constructor(combobox, element) {
    this.combobox = combobox
    this.element = element
    this.element.id = `autocomplete-list-${id++}`
    this.element.setAttribute('role', 'listbox')
    this.collection = new Collection()
  }

  disconnect() {
    this.resetCollection()
  }

  resetCollection() {
    this.setCollection(new Collection())
  }

  setCollection(collection) {
    this.collection = collection
    this.render()
  }

  render() {
    this.element.innerHTML = ''
    this.element.append(...this.collection.map(createOptionElement))
    this.element.hidden = !this.collection.length
    this.index = 0
  }

  get id() {
    return this.element.id
  }

  get index() {
    return this.elements.findIndex(isSelected)
  }

  set index(index) {
    const { elements } = this
    const lastIndex = elements.length - 1
    if (index > lastIndex) index = 0
    if (index < 0) index = lastIndex
    this.activeElement = elements[index]
  }

  set activeElement(element) {
    this.elements.forEach(deselect)
    if (element) select(element)
    this.input.activeDescendant = element
  }

  get input() {
    return this.combobox.input
  }

  get value() {
    return this.record?.value
  }

  set value(value) {
    return (this.index = this.collection.indexOf(value))
  }

  get record() {
    return this.collection.at(this.index)
  }

  get elements() {
    return Array.from(this.element.children)
  }

  get length() {
    return this.elements.length
  }
}

function createOptionElement(record, index) {
  const element = document.createElement('li')
  element.id = `autocomplete-option-${id++}-${index}`
  element.textContent = record.label
  element.setAttribute('data-detail', record.detail)
  element.setAttribute('data-value', record.value)
  element.setAttribute('role', 'option')
  return element
}

function select(element) {
  element.setAttribute('aria-selected', 'true')
  element.scrollIntoView(scrollIntoViewOptions)
}

function deselect(element) {
  element.setAttribute('aria-selected', 'false')
}

function isSelected(element) {
  return element.getAttribute('aria-selected') == 'true'
}
