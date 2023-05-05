import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleAddContent({ body, response, cardsCol }) {
  const { token, title, description, image } = body;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return response(400, { error: 'Invalid token signature' });
    }
    const userId = new ObjectId(decoded.id);
    const newCard = {
      title,
      description,
      image,
      users: [userId],
    };
    await cardsCol.insertOne(newCard);
    return response(200, { id: newCard.insertedId });
  } catch (err) {
    return response(500, {
      errorType: 'Server',
      error: `A server error occurred: ${err}`,
    });
  }
}
