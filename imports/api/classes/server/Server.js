import RedisVent from "./RedisVent";

class Server {
  #settings;
  constructor(settings) {
    this.#settings = settings;
  }

  get Config() {
    return this.#settings;
  }

  startup() {
    return Promise.all([]).then(() => {
      RedisVent.publish();
      console.log("Server started...");
    });
  }
}

export default new Server(Meteor.settings);
