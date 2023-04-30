import { MongoClient } from 'mongodb';
import process from 'node:process';
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
    const responseValues = {
      200(message) {
        return {
          statusCode: 200,
          body: JSON.stringify(message),
          headers: {
            'access-control-allow-origin': '*',
          },
        };
      },
      400(err) {
        return {
          statusCode: 400,
          headers: {
            'access-control-allow-origin': '*',
          },
          body: JSON.stringify(err),
        };
      },
      500(err) {
        return {
          statusCode: 500,
          headers: {
            'access-control-allow-origin': '*',
          },
          body: JSON.stringify({
            errorType: 'Server',
            error: `A server error occurred: ${err}`,
          }),
        };
      },
    };

    const database = client.db('wishlist');
    const collection = database.collection('usercontent');
    const body = JSON.parse(event.body);

    switch (event.path) {
      case '/addcontent': {
        return handleAddContent(body, responseValues, collection);
      }
      case '/getcontent': {
        return handleGetContent(body, responseValues, collection);
      }
      case '/deletecontent': {
        return handleDeleteContent(body, responseValues, collection);
      }
      case '/login': {
        return handleLogin(body, responseValues, collection);
      }
      case '/register': {
        return handleRegister(body, responseValues, collection);
      }
    }
  }
};
