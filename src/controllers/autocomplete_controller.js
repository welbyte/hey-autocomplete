import { Controller } from '@hotwired/stimulus'
import { Combobox } from 'lib/autocomplete'

export default class extends Controller {
  static targets = ['input', 'list', 'select']
  static values = { url: String, forbidAdding: Boolean }

  initialize() {
    this.combobox = Combobox.fromController(this)
  }

  connect() {
    this.combobox.connect()
  }

  disconnect() {
    this.combobox.disconnect()
    this.reset()
  }

  // Actions

  interceptDrop({ target, detail }) {
    if (this.element == target) {
      this.combobox.add(detail.value)
      this.reset()
    } else {
      this.combobox.remove(detail.value)
    }
  }

  search(event) {
    event?.stopPropagation()
    const { combobox } = this
    combobox.update()
    this.dispatch('search', { detail: { combobox } })
  }

  select(event) {
    const { value } = event.target.dataset
    this.combobox.value = value
  }

  commit(event) {
    event?.preventDefault()
    if (!this.combobox.commit()) return
    this.reset()
    this.inputTarget.focus()
    return true
  }

  remove(event) {
    event.preventDefault()
    event.stopPropagation()
    const { value } = event.currentTarget.dataset
    this.combobox.remove(value)
    this.inputTarget.focus()
  }

  navigate(event) {
    this.keyHandlers[event.key]?.call(this, event)
  }

  copySelected(event) {
    if (
      this.activeElementIsInScope &&
      this.selectedValue &&
      event.clipboardData
    ) {
      this.overrideClipboardEvent(event)
    }
  }

  cutSelected(event) {
    if (
      this.activeElementIsInScope &&
      this.selectedValue &&
      event.clipboardData
    ) {
      this.overrideClipboardEvent(event)
      this.combobox.remove(this.selectedValue)
    }
  }

  removeSelected(event) {
    if (event.key != 'Backspace') return
    this.combobox.remove(this.selectedValue)
    this.inputTarget.focus()
  }

  extract(event) {
    if (this.forbidAddingValue) return

    const text = event.clipboardData?.getData('text/plain')
    if (!text) return

    const parser = this.parsers[this.inputTarget.type]
    if (!parser) return

    const values = parser(text)
    if (!values.length) return

    event.preventDefault()

    for (const value of values) {
      this.combobox.add(value)
    }

    this.reset()
  }

  teardown(event) {
    if (event.type == 'submit' && event.target != this.form) return
    this.add() || this.reset()
  }

  // Private

  commitOrAdd() {
    return this.commit() || this.add()
  }

  add() {
    if (this.forbidAddingValue) return
    if (!this.inputTarget.checkValidity()) return
    const { value } = this.inputTarget
    if (!value) return
    this.combobox.add(value)
    this.reset()
    return true
  }

  reset() {
    this.inputTarget.value = ''
    this.search()
  }

  overrideClipboardEvent(event) {
    event.preventDefault()
    event.clipboardData.setData('text/plain', this.selectedValue)
  }

  get form() {
    return this.selectTarget.form
  }

  get activeElementIsInScope() {
    const { activeElement } = document
    return activeElement != null && this.scope.containsElement(activeElement)
  }

  get selectedValue() {
    return document.activeElement?.getAttribute('data-value')
  }

  keyHandlers = {
    ArrowDown(event) {
      this.combobox.index++
      event.preventDefault()
    },
    ArrowUp(event) {
      this.combobox.index--
      event.preventDefault()
    },
    Backspace(event) {
      if (this.inputTarget.value) return
      this.combobox.removeLast()
    },
    Escape(event) {
      this.combobox.collapse()
    },
    Enter(event) {
      if (!this.commitOrAdd()) return
      event.preventDefault()
    },
    Tab(event) {
      if (!this.commit()) return
      event.preventDefault()
    },
    [','](event) {
      if (!this.commitOrAdd()) return
      event.preventDefault()
    },
    [';'](event) {
      if (!this.commitOrAdd()) return
      event.preventDefault()
    },
  }

  parsers = {
    email(string = '') {
      const values = []
      for (const part of string.split(/,|\n/)) {
        const value = part.trim().match(/(.*<?\S+@\S+\.\S+>?)/)?.[1]
        if (value) values.push(value.replace(/^mailto:/, ''))
      }
      return values
    },
  }
}
