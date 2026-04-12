import mongoose from "mongoose";
import { AccountDeletionToken } from "@/models/AccountDeletionToken";
import { Conversation } from "@/models/Conversation";
import { Job } from "@/models/Job";
import { Message } from "@/models/Message";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import { User } from "@/models/User";

/** Remove vagas, conversas, mensagens e tokens associados ao contratante e apaga o usuário. */
export async function purgeUserData(userId: mongoose.Types.ObjectId) {
  const convs = await Conversation.find({ contractorId: userId }).select("_id").lean();
  const ids = convs.map((c) => c._id);
  if (ids.length) {
    await Message.deleteMany({ conversationId: { $in: ids } });
    await Conversation.deleteMany({ _id: { $in: ids } });
  }
  await Job.deleteMany({ contractorId: userId });
  await PasswordResetToken.deleteMany({ userId });
  await AccountDeletionToken.deleteMany({ userId });
  await User.deleteOne({ _id: userId });
}
