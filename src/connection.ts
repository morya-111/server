import { Connection, createConnection, getConnection, getConnectionManager } from "typeorm";
import dbConfig from "./dbConfig";

let pending: Promise<Connection> | null = null;

const connection = {
  async create() {
    await createConnection(dbConfig);
  },

  // Idempotent: reuses the connection across requests on a warm instance.
  async ensure() {
    const manager = getConnectionManager();
    if (manager.has("default") && manager.get("default").isConnected) return;
    if (!pending) {
      pending = createConnection(dbConfig).catch((err) => {
        pending = null;
        throw err;
      });
    }
    await pending;
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    // Fetch all the entities
    const entities = getConnection().entityMetadatas;

    for (const entity of entities) {
      const repository = getConnection().getRepository(entity.name); // Get repository
      await repository.delete({}); // Clear each entity table's content
    }
  },
};
export default connection;
