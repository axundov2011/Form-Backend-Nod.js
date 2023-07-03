import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
      unique: true,
    },

    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      //Userin id sini istediyimizde bele yaziriq
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);

//Biz hal hazirda model yaratdiq. Daha sonra nvs (model vew controller) yazacagiq
