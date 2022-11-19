import { memoize } from 'lib/autocomplete/util'

export class Selection {
  constructor(combobox, element) {
    this.combobox = combobox
    this.element = element
    this.elements = []
    this.observer = new MutationObserver(this.optionsChanged)
  }

  connect() {
    this.observer.observe(this.element, { childList: true })
    this.render()
  }

  disconnect() {
    this.observer.disconnect()
    this.render()
  }

  add(value, label = value) {
    this.element.append(
      this.findOption(value) || this.createOption(value, label),
    )
    return true
  }

  remove(value) {
    this.findOption(value)?.remove()
  }

  removeLast() {
    this.lastOption?.remove()
  }

  findOption(value) {
    return this.options.find((option) => option.value == value)
  }

  createOption(value, label) {
    return new Option(label, value, true, true)
  }

  get lastOption() {
    return this.options.slice(-1)[0]
  }

  get options() {
    return Array.from(this.element.options)
  }

  get values() {
    return this.options.map((option) => option.value)
  }

  get length() {
    return this.options.length
  }

  // Private

  optionsChanged = () => {
    this.render()
    this.notify()
    this.dispatch()
  }

  render() {
    for (const element of this.elements) element.remove()
    this.elements = this.element.isConnected
      ? this.options.map(this.renderElementForOption)
      : []
  }

  notify() {
    this.combobox.notifyComponents('selectionChanged')
  }

  dispatch(type = 'input', { bubbles = true } = {}) {
    this.element.dispatchEvent(new CustomEvent(type, { bubbles }))
  }

  renderElementForOption = ({ value, label }) => {
    const content = this.template.content.cloneNode(true)
    content
      .querySelectorAll('[data-value]')
      .forEach((element) => (element.dataset.value = value))
    content.querySelector('[data-content=label]').textContent = label
    content.querySelector('[data-content=label]').title = value
    content.querySelector(
      '[data-content=screenReaderLabel]',
    ).textContent = label
    return this.template.insertAdjacentElement(
      'beforebegin',
      content.firstElementChild,
    )
  }

  get template() {
    const id = this.element.getAttribute('data-template-id')
    return memoize(this, 'template', document.getElementById(id))
  }
}
