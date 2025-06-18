const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isPinned: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
    isBinned: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Note = model("Note", NoteSchema);

module.exports = Note;
