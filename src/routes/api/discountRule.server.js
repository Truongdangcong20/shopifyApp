import mongoose from 'mongoose';

import {config} from 'dotenv';

config();

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
    },
    product_target: {
      type: [String],
    },
    customer_target: {
      type: [String],
    },
    non_customer_target: {
      type: [String],
    },
    discount: {
      type: [
        {
          type: Object,
          required: true,
          from: {
            type: String,
            required: true,
          },
          to: {
            type: String | null,
            required: true,
          },
          value: {
            type: Number,
            required: true,
          },
          _type: {
            type: String,
            required: true,
            enum: ['percent', 'fixed'],
          },
        },
      ],
      required: true,
    },
    requirements: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: true,
  },
);

const DiscountModel = mongoose.model('Discount', discountSchema);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function api() {
  return await DiscountModel.find({});
}
