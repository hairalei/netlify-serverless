require('dotenv').config();

const Airtable = require('airtable-node');

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('appItRIOvDiqc9W9W')
  .table('products');

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;

  if (id) {
    try {
      const product = await airtable.retrieve(id);

      if (product.error) {
        return {
          statusCode: 404,
          body: 'No product with id',
        };
      }
    } catch (error) {
      console.log(error);
    }

    return {
      statusCode: 200,
      body: 'Single Product',
    };
  }

  return {
    statusCode: 400,
    body: 'Please provide id',
  };
};
