import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleGetContent({ body, response, userCol }) {
  const { token } = body;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(`Token error: ${err}`);
      return response(400, { error: 'Invalid token signature' });
    }
    /**
     * @description Inner join users and cards where
     * userId is in card's users array. Limit result to
     * current user request and return only their cards
     */
    const mongoRes = await userCol
      .aggregate([
        { $project: { cards: 1 } },
        { $match: { _id: { $eq: new ObjectId(decoded.id) } } },
        {
          $lookup: {
            from: 'cards',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: { $expr: { $in: ['$$id', '$users'] } },
              },
              {
                $project: {
                  title: 1,
                  description: 1,
                  image: 1,
                  _id: 0,
                  id: {
                    $toString: '$_id',
                  },
                },
              },
            ],
            as: 'cards',
          },
        },
      ])
      .toArray();
    const { cards } = mongoRes[0];
    return response(200, cards);
  } catch (err) {
    console.log(`Error fetching cards: ${err}`);
    return response(500, { error: 'Error fetching cards.' });
  }
}
