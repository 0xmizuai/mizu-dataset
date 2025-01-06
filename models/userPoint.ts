import mongoose from "mongoose";

export interface IUserPoint {
  user_key: string;
  user_key_type: string;
}

export const userPointSchema = new mongoose.Schema<IUserPoint>(
  {
    user_key: { type: String, unique: true },
    user_key_type: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "user_reward_points",
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

userPointSchema.index({ user_key: 1, user_key_type: 1 }, { unique: true });

export const UserPointModel =
  mongoose.connection.useDb("user").models.UserPointModel ||
  mongoose.connection.useDb("user").model("UserPointModel", userPointSchema);
