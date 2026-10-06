import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
      validate: {
        validator: (value) => value <= new Date(Date.now() + 24 * 60 * 60 * 1000),
        message: 'Purchase date cannot be in the future',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes must not exceed 300 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

purchaseSchema.virtual('items', {
  ref: 'PurchaseItem',
  localField: '_id',
  foreignField: 'purchaseId',
});

purchaseSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

purchaseSchema.virtual('storeName').get(function () {
  return this.store ? this.store.name : undefined;
});

purchaseSchema.virtual('totalAmount').get(function () {
  if (!this.items) return undefined;
  const total = this.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  return Math.round(total * 100) / 100;
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;