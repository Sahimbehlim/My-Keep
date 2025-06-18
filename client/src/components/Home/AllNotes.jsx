import React from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { NoteBox, SingleNote, EmptyBox, GridLayout } from "./common/index";
import { useNotes } from "../../context/noteContext";

const AllNotes = () => {
  const { notes } = useNotes();

  const { pinnedNotes, unpinnedNotes } = notes.reduce(
    (acc, note) => {
      if (!note.isArchive && !note.isBinned) {
        note.isPinned
          ? acc.pinnedNotes.push(note)
          : acc.unpinnedNotes.push(note);
      }
      return acc;
    },
    { pinnedNotes: [], unpinnedNotes: [] }
  );

  return (
    <div className="flex flex-col gap-y-8 pl-24 pt-20 pe-4 min-h-screen">
      <NoteBox />

      {pinnedNotes.length > 0 && (
        <NotesSection label="Pinned" notes={pinnedNotes} />
      )}

      {unpinnedNotes.length > 0 && (
        <NotesSection
          label={pinnedNotes.length > 0 ? "Others" : ""}
          notes={unpinnedNotes}
        />
      )}

      {pinnedNotes.length === 0 && unpinnedNotes.length === 0 && (
        <EmptyBox
          Icon={FaRegLightbulb}
          text="Notes that you add appear here"
          className={"mt-[4.5rem]"}
        />
      )}
    </div>
  );
};

const NotesSection = ({ label, notes }) => (
  <div className="flex flex-col gap-y-2">
    {label && <Label text={label} />}
    <GridLayout>
      {notes.map((note) => (
        <SingleNote key={note._id} note={note} />
      ))}
    </GridLayout>
  </div>
);

const Label = ({ text }) => {
  return (
    <label className="text-[12px] uppercase text-gray-600 ms-2 font-medium">
      {text}
    </label>
  );
};

export default AllNotes;
