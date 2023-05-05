import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleDeleteContent({
  body,
  response,
  collection,
}) {
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
    return response(200, { updatedContent });
  } catch (err) {
    return response(500, {
      errorType: 'Server',
      error: `A server error occurred: ${err}`,
    });
  }
}
