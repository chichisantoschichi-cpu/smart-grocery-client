import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      unique: true,
      trim: true,
      maxlength: [80, 'Store name cannot exceed 80 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
      default: '',
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [/^(09\d{9}|\+639\d{9})?$/, 'Contact number must be a valid PH mobile number'],
      default: '',
    },
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);

export default Store;