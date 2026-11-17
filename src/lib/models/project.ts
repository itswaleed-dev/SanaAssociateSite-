import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: 'Architecture' | 'Interior' | 'Exterior';
  location: string;
  year: number;
  description: string;
  coverImage: string;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['Architecture', 'Interior', 'Exterior'], required: true },
    location: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
