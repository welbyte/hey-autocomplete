export function memoize(object, name, value) {
  Object.defineProperty(object, name, { value })
  return value
}

export function normalize(string = '') {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export const scrollIntoViewOptions = {
  block: 'nearest',
  behavior: 'smooth',
  // behavior: 'scrollBehavior' in document.body.style ? 'smooth' : 'auto',
}
