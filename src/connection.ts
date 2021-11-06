import { createConnection, getConnection } from "typeorm";

const connection = {
  async create() {
    await createConnection();
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
