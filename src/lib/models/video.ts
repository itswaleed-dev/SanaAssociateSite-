import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  url: string;
  title: string;
  type: 'youtube' | 'mp4';
  thumbnail: string;
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    url: { type: String, required: true },
    title: { type: String, default: '' },
    type: { type: String, enum: ['youtube', 'mp4'], default: 'youtube' },
    thumbnail: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
