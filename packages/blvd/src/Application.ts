import ModelConstructor from './model/ModelConstructor'
import coordinator from './coordinator'

// The application is the single object passed to both the client and server so that they may know all the models and coordinate the models
// between oneanother. In the future, it may hold functions to ease this process. As of right now, it just stores an array of models and
// responds with itself when the coordinator asks.
export default class Application {
  constructor (public models: ModelConstructor[]) {
    // Set ourselves up with the coordinator so if anyone asks we can point them this-a-way.
    coordinator.on('app', () => {
      coordinator.emit('app-response', this)
    })
  }
}
