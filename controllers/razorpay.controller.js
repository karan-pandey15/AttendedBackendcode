import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_live_5PPrr1z0Y5RqDP',
  key_secret: 'e9ECp41GXpsAhkozANAvwUCS'
});

export const razorpayController = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const payment_capture = 1;
    const options = {
      amount: amount * 100,  
      currency,
      receipt,
      payment_capture
    };

    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
