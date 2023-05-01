import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handleLogin(body, responseValues, collection) {
  try {
    const username = body.username.toLowerCase();
    const { password } = body;
    const user = await collection.findOne({ username });
    if (!user) {
      return responseValues[400]({
        errorType: 'User',
        error: 'User does not exist.',
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.hash);
    if (!isPasswordCorrect) {
      return responseValues[400]({
        errorType: 'Password',
        error: 'Password is incorrect.',
      });
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    return responseValues[200]({ message: 'Logged in.', jwt: token });
  } catch (err) {
    console.log(`Server error: ${err}`);
    return responseValues[500](err);
  }
}
