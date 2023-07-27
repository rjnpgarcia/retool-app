import Watcher from "./Watcher";

class Client extends Watcher {
  constructor(parent) {
    super(parent);
    this.secureTransaction();
  }
}

export default new Client();
