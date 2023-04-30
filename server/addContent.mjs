import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleAddContent(
  body,
  responseValues,
  collection
) {
  const token = body.jwt;
  const title = body.title;
  const description = body.description;
  const image = body.image;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const user = await collection.findOne({ username });
    const content = user.content;
    const updatedContent = [...content, { title, description, image }];
    await collection.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { content: updatedContent } }
    );
    return responseValues[200]({ updatedContent });
  } catch (err) {
    return responseValues[500](err);
  }
}