import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    image: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
