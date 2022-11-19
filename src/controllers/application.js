import { Application } from '@hotwired/stimulus'

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

import AutocompleteController from './autocomplete_controller'
Stimulus.register('autocomplete', AutocompleteController)

export { application }
