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
    console.log(session);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
