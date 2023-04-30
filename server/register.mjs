import bcrypt from 'bcryptjs';
import { getSeedContent } from './utils.mjs';

export default async function handleRegister(body, responseValues, collection) {
  const username = body.username.toLowerCase();
  const { password } = body;

  try {
    const user = await collection.findOne({ username });
    if (user) {
      return responseValues[400]({
        errorType: 'User',
        error: 'User is already registered.',
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const seedContent = getSeedContent();
    const newUser = {
      username,
      hash,
      content: seedContent,
    };
    const result = await collection.insertOne(newUser);
    return responseValues[200]({
      message: `User successfully registered with _id: ${result.insertedId}`,
      error: null,
    });
  } catch (err) {
    return responseValues[500](err);
  }
}
