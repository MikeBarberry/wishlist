import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handleGetContent({ body, response, collection }) {
  const token = body.jwt;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return response(400, { error: 'Invalid token signature' });
    }
    const mongoRes = await collection
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
    return response(500, { error: err });
  }
}
