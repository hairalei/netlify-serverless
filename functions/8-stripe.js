require('dotenv').config();

const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  if (method !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST requests allowed',
    };
  }

  const { items, total_amount, shipping_fee } = JSON.parse(event.body);
  const calculateOrderAmount = () => {
    return shipping_fee + total_amount;
  };

  console.log(items, total_amount, shipping_fee);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      currency: 'usd',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
