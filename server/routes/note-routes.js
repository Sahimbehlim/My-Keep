const express = require("express");
const {
  allNotesHandler,
  addNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
  toggleStatusHandler,
  emptyBinHandler,
} = require("../controllers/note-controller");
const router = express.Router();

// GET all notes
router.get("/", allNotesHandler);

// Add a new note
router.post("/", addNoteHandler);

// Update or delete a specific note
router.route("/:id").patch(updateNoteHandler).delete(deleteNoteHandler);

// Toggle status of a note (pin, archive, bin)
router.patch("/:id/toggle-status", toggleStatusHandler);

// Empty bin
router.delete("/bin/empty", emptyBinHandler);

module.exports = router;
