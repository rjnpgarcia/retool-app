import Watcher from "../Watcher";
import Client from "../Client";
import { QUERY, SOURCE } from "../../common/const";
import RedisVent from "../RedisVent";

class ResourceWatcher extends Watcher {
  #collectionNames = [];
  #db = {};
  #db2 = {};
  #lastbasis = null;
  #lastbasis2 = null;
  #querySuggest = [];
  // #valuesSuggest = [];
  constructor(parent) {
    super(parent);
    RedisVent.Data.prepareCollection("data");
    this.#db = RedisVent.Data.getCollection("data");
    RedisVent.Data2.prepareCollection("data2");
    this.#db2 = RedisVent.Data2.getCollection("data2");
  }

  get CollectionNames() {
    return this.#collectionNames;
  }

  get SourceData() {
    return this.#db;
  }

  get SourceData2() {
    return this.#db2;
  }

  get QuerySuggest() {
    return this.#querySuggest;
  }

  getDataFromDB(data) {
    this.Parent.callFunc(SOURCE.GET, data)
      .then((data) => {
        console.log(data);
        data.collectionNames.forEach((collection) => {
          this.#collectionNames.push(collection);
        });
        alert("Query Successful!");
        this.Parent.activateWatcher();
      })
      .catch(console.log);
  }

  getData(data) {
    this.Parent.callFunc(SOURCE.INSERT, {
      data,
      lastbasis: this.#lastbasis,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          data.data.forEach((item) => {
            // this.addData(item);
            console.log(item);
            this.#db.insert(item);
          });
          this.#lastbasis = data.lastbasis;
        }
        console.log(this.#lastbasis);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }

  getData2(data) {
    this.Parent.callFunc(SOURCE.INSERT, {
      data,
      lastbasis: this.#lastbasis2,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          data.data.forEach((item) => {
            // this.addData(item);
            console.log(item);
            this.#db2.insert(item);
          });
          this.#lastbasis2 = data.lastbasis;
        }
        console.log(this.#lastbasis2);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }

  getQuery(data) {
    this.Parent.callFunc(QUERY.GET, {
      data,
      lastbasis: this.#lastbasis,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          data.data.forEach((item) => {
            // this.addData(item);
            console.log(item);
            this.#db.insert(item);
          });
          this.#lastbasis = data.lastbasis;
        }
        console.log(this.#lastbasis);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }

  getFieldNames(data) {
    this.Parent.callFunc(QUERY.SEARCH, data)
      .then((data) => {
        this.#querySuggest = [];
        data.fieldNames.forEach((field) => {
          this.#querySuggest.push(field);
        });
        console.log(data);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }

  getQuery2(data) {
    this.Parent.callFunc(QUERY.GET, {
      data,
      lastbasis: this.#lastbasis2,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          data.data.forEach((item) => {
            // this.addData(item);
            console.log(item);
            this.#db2.insert(item);
          });
          this.#lastbasis2 = data.lastbasis;
        }
        console.log(this.#lastbasis2);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }
  getQueryWithValues(data) {
    this.Parent.callFunc(QUERY.VALUES.GET, {
      data,
      lastbasis: this.#lastbasis,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          data.data.forEach((item) => {
            // this.addData(item);
            console.log(item);
            this.#db.insert(item);
          });
          this.#lastbasis = data.lastbasis;
        }
        console.log(this.#lastbasis);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }
  
  getQueryWithValues2(data) {
    this.Parent.callFunc(QUERY.VALUES.GET, {
      data,
      lastbasis: this.#lastbasis2,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          data.data.forEach((item) => {
            // this.addData(item);
            console.log(item);
            this.#db2.insert(item);
          });
          this.#lastbasis2 = data.lastbasis;
        }
        console.log(this.#lastbasis2);
        this.Parent.activateWatcher();
      })
      .catch((err) => {
        console.log(err);
        this.Parent.activateWatcher();
      });
  }

  reset() {
    this.#db.remove({});
    this.#lastbasis = null;
    this.activateWatcher();
  }
  reset2() {
    this.#db2.remove({});
    this.#lastbasis2 = null;
    this.activateWatcher();
  }
}

export default new ResourceWatcher(Client);
