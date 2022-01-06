const Art = require("../models/artModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.generateCheckoutSession = async (req, res) => {
  try {
    //fetch artist
    var { artId } = req.params;
    //retrieve data and pass it to session obj
    var art = await Art.findById(artId);
    var { title, description, cost, coverPhoto } = art;
    //geenrating stripe checkout session object
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        buyer: `${req.user._id}`,
        art: artId,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images: [coverPhoto],
              description,
            },
            unit_amount: cost,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/`,
    });
    res.status(200).json({
      status: "success",
      data: {
        session,
      },
    });
    // console.log(session);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.stripeWebHook = (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("session checkout completed");
  }
  // Handle the event
  // switch (event.type) {
  //   case "payment_intent.succeeded":
  //     const paymentIntent = event.data.object;
  //     console.log("PaymentIntent was successful!");
  //     break;
  //   case "payment_method.attached":
  //     const paymentMethod = event.data.object;
  //     console.log("PaymentMethod was attached to a Customer!");
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
