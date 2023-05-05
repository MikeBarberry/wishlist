import process from 'node:process';
import { MongoClient } from 'mongodb';
import {
  handleAddContent,
  handleDeleteContent,
  handleGetContent,
  handleLogin,
  handleRegister,
} from './index.mjs';

const client = new MongoClient(process.env.MONGO_URI);

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'access-control-allow-headers':
          'content-type,x-amz-date,authorization,x-api-key,x-amz-security-token,origin,accept',
        'access-control-allow-methods': 'options,post,get,put,delete',
        'access-control-allow-origin': '*',
      },
    };
  } else if (event.httpMethod === 'POST') {
    function response(statusCode, body) {
      return {
        statusCode,
        headers: {
          'access-control-allow-origin': '*',
        },
        body: JSON.stringify(body),
      };
    }

    const database = client.db('wishlist');
    const userCol = database.collection('usercontent');
    const cardsCol = database.collection('cards');
    const body = JSON.parse(event.body);

    const args = { body, response, collection: userCol };

    switch (event.path) {
      case '/addcontent': {
        return handleAddContent({ ...args });
      }
      case '/getcontent': {
        return handleGetContent({ ...args });
      }
      case '/deletecontent': {
        return handleDeleteContent({ ...args });
      }
      case '/login': {
        return handleLogin({ ...args });
      }
      case '/register': {
        return handleRegister({ ...args, cardsCol });
      }
    }
  }
};
