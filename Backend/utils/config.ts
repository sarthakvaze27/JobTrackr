const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is missing. Set it in Backend/.env before starting the server.');
}

export default jwtSecret;
