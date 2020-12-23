import mongodb from 'mongodb';

class DB {
  #host;
  #database;
  #username;
  #password;
  #connect = null;
  #instance = null;

  init(host, database, username, password) {
    this.#host = host;
    this.#database = database;
    this.#username = username;
    this.#password = password;
  }

  async getInstance() {
    if (this.#instance === null) {
      let connect = await this.getConnect();
      this.#instance = connect.db(this.#database);
    }
    return this.#instance;
  }

  async getConnect() {
    if (this.#connect === null) {
      this.#connect = await mongodb.MongoClient.connect(
        `mongodb://${encodeURIComponent(this.#username)}:${encodeURIComponent(this.#password)}@${this.#host}/`,
        {useUnifiedTopology: true}
      );
    }
    return this.#connect;
  }

  async close() {
    let connect = await this.getConnect();
    await connect.close();
    this.#instance = null;
    this.#connect = null;
  }
}

const db = new DB();

export default db