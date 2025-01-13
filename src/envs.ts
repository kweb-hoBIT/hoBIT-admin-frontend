export const envs: HobitEnv = {
  HOBIT_BACKEND_ENDPOINT: process.env.HOBIT_BACKEND_ENDPOINT || 'http://localhost:5001',
};

interface HobitEnv {
  HOBIT_BACKEND_ENDPOINT: string | undefined;
}
