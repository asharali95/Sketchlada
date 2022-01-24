const Art = require("../models/artModel");
const Order = require("../models/orderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.generateCheckoutSession = async (req, res) => {
  try {
    //fetch artist
    var { artId } = req.params;
    //retrieve data and pass it to session obj
    var art = await Art.findById(artId);
    var {
      title,
      description,
      cost,
      artist: { _id: artistId },
      coverPhoto,
    } = art;
    //geenrating stripe checkout session object
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        buyer: `${req.user._id}`,
        art: artId,
        artist: `${artistId}`,
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
            unit_amount: cost * 100,
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

exports.stripeWebHook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (event.type === "checkout.session.completed") {
      var {
        data: {
          object: { metadata },
        },
      } = event;
      var order = await Order.create(metadata);
      //changing art status to sold
      await Art.findByIdAndUpdate(metadata.art, { status: "sold" });
      //TODO: save event.data.object details to transaction Collection
    }
    response.json({ received: true });
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
};
