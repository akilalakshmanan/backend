import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
      productIdStripe: { type: String, required: true, unique: true},
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      image: { type: String, required: true },
      images: [String],
      brand: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      priceIdStripe: { type: String, required: true},
      countInStock: { type: Number, required: true },
      isActive: {type: Boolean, required: true}
    },
    {
      timestamps: true,
    }
  );

const Product = mongoose.model('Product',productSchema);
export default Product;