import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleDeleteContent(
  body,
  responseValues,
  collection
) {
  const token = body.jwt;
  const title = body.title;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const user = await collection.findOne({ username });
    const { content } = user;
    const updatedContent = content.filter(
      (item) => item.title.toLowerCase() !== title.toLowerCase()
    );
    await collection.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { content: updatedContent } }
    );
    return responseValues[200]({ updatedContent });
  } catch (err) {
    return responseValues[500](err);
  }
}
