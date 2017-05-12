import { EventEmitter2 as EE } from 'eventemitter2'

// The coordinator handles conversations between different common files.

// It is understood that when you import a Model, it does not know its surrounding context. This is how a Model should be written. But
// sometimes, a model needs to know stuff around what is around it. Specifically, it needs to know what application it is in.

// Here is our coordinator for the evening:
const coordinator = new EE()

// When you create a new application, it will take this coordinator and add to it a single listener to respond when someone emits an 'app'
// event. It will respond with an app-response event, with itself as an argument.
export default coordinator

// Go out with this knowledge and, well, coordinate.
