import bcrypt from 'bcryptjs';

export default async function handleRegister({
  body,
  response,
  collection,
  cardsCol,
}) {
  const username = body.username.toLowerCase();
  const { password } = body;

  try {
    const user = await collection.findOne({ username });
    if (user) {
      return response(400, {
        errorType: 'User',
        error: 'User is already registered.',
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await collection.insertOne({
      username,
      hash,
    });
    const newUserID = newUser.insertedId;
    const defaultCards = await cardsCol.aggregate([
      {
        $match: {
          $expr: {
            $in: [
              '$title',
              [
                'Xenia',
                'Candy Cane',
                'Zoa',
                'Chalice',
                'Finger leather',
                'SPS',
                'Frogspawn',
                'Hammerhead',
                'Anemone',
              ],
            ],
          },
        },
      },
    ]);
    for await (const ele of defaultCards) {
      await cardsCol.updateOne(
        { _id: ele._id },
        { $push: { users: newUserID } }
      );
    }
    return response(200, {
      message: `User successfully registered with id: ${newUserID}`,
    });
  } catch (err) {
    return response(500, {
      errorType: 'Server',
      error: `A server error occurred: ${err}`,
    });
  }
}
