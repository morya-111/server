import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getConnection } from "typeorm";
import { Auth } from "../entity/Auth";
import { User } from "../entity/User";

const { PORT = 4000 } = process.env;

let callbackUrl = "/v1/auth/google/callback";
if (process.env.NODE_ENV === "development")
	callbackUrl = `http://localhost:${PORT}${callbackUrl}`;

const configureGoogleAuth = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: callbackUrl,
			},
			async (accessToken, refreshToken, profile, cb) => {
				const { emails, name, id } = profile;
				const { value } = emails[0];

				let user = await getConnection()
					.getRepository(User)
					.createQueryBuilder("user")
					.leftJoinAndSelect("user.auth", "auth")
					.where("user.email = :email", { email: value })
					.getOne();

				if (!user) {
					// creating new user
					user = await User.create({
						email: value,
						first_name: name.givenName,
						last_name: name.familyName,
						role: "INDIVIDUAL",
					}).save();
					await Auth.create({ google_id: id, user }).save();
				} else if (!user.auth.google_id) {
					// merging google accounting with email
					user.auth.google_id = id;
					await user.auth.save();
				}

				cb(null, user);
			}
		)
	);
};

export default configureGoogleAuth;
