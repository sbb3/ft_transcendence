const { cleanEnv, str, port } = require('envalid');

const envalidOptions = {
	  API: str(),
	  PORT: port(),
	  JWT_ACCESS_TOKEN_SECRET: str(),
	  JWT_ACCESS_TOKEN_EXPIRES_IN: str(),
	  JWT_REFRESH_TOKEN_SECRET: str(),
	  JWT_REFRESH_TOKEN_EXPIRES_IN: str(),
};

const env = cleanEnv(process.env, envalidOptions);

module.exports = env;
