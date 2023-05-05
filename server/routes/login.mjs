import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handleLogin({ body, response, collection }) {
  try {
    const username = body.username.toLowerCase();
    const { password } = body;
    const user = await collection.findOne({ username });
    if (!user) {
      return response(400, {
        errorType: 'User',
        error: 'User does not exist.',
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.hash);
    if (!isPasswordCorrect) {
      return response(400, {
        errorType: 'Password',
        error: 'Password is incorrect.',
      });
    }
    const token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET);
    return response(200, { message: 'Logged in.', jwt: token });
  } catch (err) {
    console.log(`Server error: ${err}`);
    return response(500, {
      errorType: 'Server',
      error: `A server error occurred: ${err}`,
    });
  }
}
