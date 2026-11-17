import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  url: string;
  title: string;
  category: 'Architecture' | 'Interior' | 'Exterior';
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    url: { type: String, required: true },
    title: { type: String, default: '' },
    category: { type: String, enum: ['Architecture', 'Interior', 'Exterior'], default: 'Architecture' },
  },
  { timestamps: true }
);

export const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
