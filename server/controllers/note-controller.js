const mongoose = require("mongoose");
const Note = require("../models/note-schema");

const allNotesHandler = async (req, res) => {
  const { userInfo } = req;

  try {
    const allNotes = await Note.find({ createdBy: userInfo.userId }).lean();
    res
      .status(200)
      .json({ message: "Notes fetched successfully", allNotes, userInfo });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addNoteHandler = async (req, res) => {
  const { userId } = req.userInfo;
  const { title, description, isPinned, isArchive } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newNote = await Note.create({
      title,
      description,
      isPinned,
      isArchive,
      createdBy: userId,
    });
    res.status(201).json({ message: "Note added successfully", newNote });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateNoteHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, isPinned, isArchive } = req.body;
  const { userId } = req.userInfo;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, createdBy: userId },
      {
        title,
        description,
        isPinned,
        isArchive: isArchive && !isPinned,
      },
      { new: true, lean: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNoteHandler = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.userInfo;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note deleted successfully", noteId: deletedNote._id });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const toggleStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { status, name } = req.body;
  const { userId } = req.userInfo;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  const updateFields = {};
  if (name === "pin") {
    updateFields.isPinned = status.isPinned;
    updateFields.isArchive = false;
  } else if (name === "eye") {
    updateFields.isArchive = status.isArchive;
    updateFields.isPinned = false;
  } else if (name === "bin") {
    updateFields.isBinned = status.isBinned;
    updateFields.isArchive = status.isArchive;
    updateFields.isPinned = false;
  } else {
    return res.status(400).json({ error: "Invalid status type" });
  }

  try {
    const toggledResult = await Note.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateFields,
      { new: true, lean: true }
    );

    if (!toggledResult) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note status updated", toggledResult });
  } catch (error) {
    console.error("Error updating note status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const emptyBinHandler = async (req, res) => {
  const { userId } = req.userInfo;

  try {
    const { deletedCount } = await Note.deleteMany({
      isBinned: true,
      createdBy: userId,
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "No notes found in bin" });
    }

    res.status(200).json({ message: `Deleted ${deletedCount} notes from bin` });
  } catch (error) {
    console.error("Error emptying bin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  allNotesHandler,
  addNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
  toggleStatusHandler,
  emptyBinHandler,
};
