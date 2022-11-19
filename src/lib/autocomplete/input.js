export class Input {
  constructor(combobox, element) {
    this.combobox = combobox
    this.element = element
    this.element.setAttribute('aria-autocomplete', 'list')
    this.element.setAttribute('aria-controls', combobox.list.id)
    this.element.setAttribute('aria-haspopup', 'listbox')
    this.element.setAttribute('autocomplete', 'off')
    this.element.setAttribute('role', 'combobox')
    this.element.setAttribute('spellcheck', false)
  }

  connect() {
    this.take('required', 'multiple')
    this.render()
  }

  disconnect() {
    this.give('required', 'multiple')
  }

  selectionChanged() {
    this.render()
  }

  render() {
    const { length } = this.combobox.selection
    this.element.required = this.required && !length
    this.element.hidden = !this.multiple && length
  }

  take(...keys) {
    for (const key of keys) {
      this[key] = this.element[key]
      this.element.removeAttribute(key)
    }
  }

  give(...keys) {
    for (const key of keys) {
      this.element.toggleAttribute(key, this[key])
    }
  }

  get value() {
    return this.element.value.trim()
  }

  set activeDescendant(element) {
    const id = element?.id
    if (id) this.element.setAttribute('aria-activedescendant', id)
    else this.element.removeAttribute('aria-activedescendant')
  }
}
