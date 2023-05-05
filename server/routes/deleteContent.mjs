import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleDeleteContent({
  body,
  response,
  cardsCol,
}) {
  const { token, id: cardId } = body;
  const cardObjId = new ObjectId(cardId);
  const cardIdFilter = { _id: cardObjId };

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return response(400, { error: 'Invalid token signature' });
    }
    const userObjId = new ObjectId(decoded.id);
    /**
     * @description Find the number of users
     * subscribed to the card being requested
     * for deletion
     */
    const cardCountUsers = await cardsCol
      .aggregate([
        {
          $match: { _id: { $eq: cardObjId } },
        },
        {
          $project: {
            usersLength: { $size: '$users' },
          },
        },
      ])
      .toArray();
    const { usersLength } = cardCountUsers[0];
    if (usersLength === 1) {
      await cardsCol.deleteOne(cardIdFilter);
    } else {
      /**
       * @description Remove the user
       * from the card's users array
       */
      await cardsCol.updateOne(cardIdFilter, { $pull: { users: userObjId } });
    }
    return response(200, { message: 'Successfully deleted card.' });
  } catch (err) {
    return response(500, {
      errorType: 'Server',
      error: `A server error occurred: ${err}`,
    });
  }
}
