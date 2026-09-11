// Vercel function entry: `yarn build` compiles src/ with tsc (TypeORM needs
// emitted decorator metadata), then every request is routed here.
module.exports = require("../dist/app").default;
