interface Env {
  HOBIT_ADMIN_BACKEND_ENDPOINT: string;
}

function getEnv(): Env {
  const env = {
    HOBIT_ADMIN_BACKEND_ENDPOINT: process.env.REACT_APP_HOBIT_ADMIN_BACKEND_ENDPOINT,
  };

  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return env as Env;
}

const env = getEnv();

export default env;
