import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  position: string;
  image: string;
  bio: string;
  createdAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    position: { type: String, default: '' },
    image: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
