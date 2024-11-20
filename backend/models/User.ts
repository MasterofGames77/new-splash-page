import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  userId: string; // Unique user-friendly identifier
  position: number | null; // Waitlist position
  isApproved: boolean; // Approval status for main app access
  hasProAccess: boolean; // Pro access status
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  userId: { type: String, unique: true, required: true, default: () => `user-${Date.now()}` }, // Unique identifier with default value
  position: { type: Number, default: null }, // Allow null for the position if not assigned yet
  isApproved: { type: Boolean, default: false },
  hasProAccess: { type: Boolean, default: false },
}, { collection: 'users' }); // Name of the collection in MongoDB

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;