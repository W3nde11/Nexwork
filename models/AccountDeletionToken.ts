import mongoose, { Schema, models, model } from "mongoose";

export interface IAccountDeletionToken {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const AccountDeletionTokenSchema = new Schema<IAccountDeletionToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

AccountDeletionTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AccountDeletionToken =
  models.AccountDeletionToken ??
  model<IAccountDeletionToken>("AccountDeletionToken", AccountDeletionTokenSchema);
