// This is your test publishable API key.

const stripe = Stripe(
  'pk_test_51LWEziEf5qQuMPWdoMWkEh1TgEw5e9GaqRtAomZSdSX6lzSgVkpEz0E6edJM1n8SmuXSbanlJcj7KgXX2vzM3PBS00xBsoWCUi'
);

// The items the customer wants to buy

const items = [
  { id: '1', name: 't-shirt', price: 1999 },
  { id: '2', name: 'shoes', price: 4999 },
];
const total_amount = 8998;
const shipping_fee = 1099;
let elements;

initialize();
checkStatus();

document
  .querySelector('#payment-form')
  .addEventListener('submit', handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch('/api/8-stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, total_amount, shipping_fee }),
  });
  const { clientSecret } = await response.json();

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: 'https://dashboard.stripe.com/test/payments/',
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === 'card_error' || error.type === 'validation_error') {
    showMessage(error.message);
  } else {
    showMessage('An unexpected error occurred.');
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case 'succeeded':
      showMessage('Payment succeeded!');
      break;
    case 'processing':
      showMessage('Your payment is processing.');
      break;
    case 'requires_payment_method':
      showMessage('Your payment was not successful, please try again.');
      break;
    default:
      showMessage('Something went wrong.');
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector('#payment-message');

  messageContainer.classList.remove('hidden');
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add('hidden');
    messageText.textContent = '';
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector('#submit').disabled = true;
    document.querySelector('#spinner').classList.remove('hidden');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('#submit').disabled = false;
    document.querySelector('#spinner').classList.add('hidden');
    document.querySelector('#button-text').classList.remove('hidden');
  }
}

// const purchase = [
//   { id: '1', name: 't-shirt', price: 1999 },
//   { id: '2', name: 'shoes', price: 4999 },
// ]
// const total_amount = 6998
// const shipping_fee = 1099
// var stripe = Stripe('YOUR_PUBLIC_KEY')

// // The items the customer wants to buy

// // Disable the button until we have Stripe set up on the page
// document.querySelector('button').disabled = true
// fetch('/api/8-stripe', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ purchase, total_amount, shipping_fee }),
// })
//   .then(function (result) {
//     return result.json()
//   })
//   .then(function (data) {
//     var elements = stripe.elements()

//     var style = {
//       base: {
//         color: '#32325d',
//         fontFamily: 'Arial, sans-serif',
//         fontSmoothing: 'antialiased',
//         fontSize: '16px',
//         '::placeholder': {
//           color: '#32325d',
//         },
//       },
//       invalid: {
//         fontFamily: 'Arial, sans-serif',
//         color: '#fa755a',
//         iconColor: '#fa755a',
//       },
//     }

//     var card = elements.create('card', { style: style })
//     // Stripe injects an iframe into the DOM
//     card.mount('#card-element')

//     card.on('change', function (event) {
//       // Disable the Pay button if there are no card details in the Element
//       document.querySelector('button').disabled = event.empty
//       document.querySelector('#card-error').textContent = event.error
//         ? event.error.message
//         : ''
//     })

//     var form = document.getElementById('payment-form')
//     form.addEventListener('submit', function (event) {
//       event.preventDefault()
//       // Complete payment when the submit button is clicked
//       payWithCard(stripe, card, data.clientSecret)
//     })
//   })

// // Calls stripe.confirmCardPayment
// // If the card requires authentication Stripe shows a pop-up modal to
// // prompt the user to enter authentication details without leaving your page.
// var payWithCard = function (stripe, card, clientSecret) {
//   loading(true)
//   stripe
//     .confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: card,
//       },
//     })
//     .then(function (result) {
//       if (result.error) {
//         // Show error to your customer
//         showError(result.error.message)
//       } else {
//         // The payment succeeded!
//         orderComplete(result.paymentIntent.id)
//       }
//     })
// }

// /* ------- UI helpers ------- */

// // Shows a success message when the payment is complete
// var orderComplete = function (paymentIntentId) {
//   loading(false)
//   document
//     .querySelector('.result-message a')
//     .setAttribute(
//       'href',
//       'https://dashboard.stripe.com/test/payments/' + paymentIntentId
//     )
//   document.querySelector('.result-message').classList.remove('hidden')
//   document.querySelector('button').disabled = true
// }

// // Show the customer the error from Stripe if their card fails to charge
// var showError = function (errorMsgText) {
//   loading(false)
//   var errorMsg = document.querySelector('#card-error')
//   errorMsg.textContent = errorMsgText
//   setTimeout(function () {
//     errorMsg.textContent = ''
//   }, 4000)
// }

// // Show a spinner on payment submission
// var loading = function (isLoading) {
//   if (isLoading) {
//     // Disable the button and show a spinner
//     document.querySelector('button').disabled = true
//     document.querySelector('#spinner').classList.remove('hidden')
//     document.querySelector('#button-text').classList.add('hidden')
//   } else {
//     document.querySelector('button').disabled = false
//     document.querySelector('#spinner').classList.add('hidden')
//     document.querySelector('#button-text').classList.remove('hidden')
//   }
// }
