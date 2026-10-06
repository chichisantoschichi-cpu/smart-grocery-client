import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase',
      required: [true, 'Purchase is required'],
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name must not exceed 100 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than 0'],
      max: [10000, 'Quantity is too large'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0.01, 'Unit price must be greater than 0'],
      max: [100000, 'Unit price is too high'],
    },
  },
  { timestamps: true }
);

purchaseItemSchema.virtual('subtotal').get(function () {
  return Math.round(this.quantity * this.unitPrice * 100) / 100;
});

const PurchaseItem = mongoose.model('PurchaseItem', purchaseItemSchema, 'purchaseItems');

export default PurchaseItem;