import jwt from 'jsonwebtoken';

export default async function handleGetContent(
  body,
  responseValues,
  collection
) {
  const token = body.jwt;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const user = await collection.findOne({ username });
    return responseValues[200]({ userContent: user.content });
  } catch (err) {
    return responseValues[500](err);
  }
}
