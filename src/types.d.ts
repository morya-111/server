import { User } from "./entity/User";
export type RoleType = "INDIVIDUAL" | "SHOP_OWNER" | "ADMIN";

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
