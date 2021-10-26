import { createConnection, getConnection } from "typeorm";

const connection = {
	async create() {
		await createConnection();
	},

	async close() {
		await getConnection().close();
	},

	async clear() {
		const connection = getConnection();
		const entities = connection.entityMetadatas;

		entities.forEach(async (entity) => {
			const repository = connection.getRepository(entity.name);
			await repository.clear();
		});
	},
};
export default connection;
