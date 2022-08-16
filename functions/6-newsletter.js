require('dotenv').config();
const axios = require('axios');

const url = `https://api.buttondown.email/v1/subscribers`;

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  console.log(method);

  if (method !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST requests allowed',
    };
  }

  const { email } = JSON.parse(event.body);

  if (!email.trim()) {
    return {
      statusCode: 400,
      body: 'Please provide valid email value',
    };
  }

  try {
    const data = await axios.post(
      url,
      { email },
      {
        headers: {
          Authorization: `Token ${process.env.EMAIL_KEY}`,
        },
      }
    );

    console.log(data);
    return {
      statusCode: 201,
      body: 'Success',
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error.response.data),
    };
  }
};
