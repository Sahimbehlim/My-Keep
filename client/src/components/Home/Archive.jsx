import React from "react";
import { BiArchiveIn } from "react-icons/bi";
import { EmptyBox, SingleNote, GridLayout } from "./common/index";
import { useNotes } from "../../context/noteContext";

const Archive = () => {
  const { notes } = useNotes();

  const archivedNotes = notes.reduce((acc, note) => {
    if (note.isArchive && !note.isBinned) acc.push(note);
    return acc;
  }, []);

  return (
    <div className="pl-24 pt-20 pe-4 min-h-screen">
      {archivedNotes.length > 0 ? (
        <GridLayout>
          {archivedNotes.map((note) => (
            <SingleNote key={note._id} note={note} />
          ))}
        </GridLayout>
      ) : (
        <EmptyBox Icon={BiArchiveIn} text="Your archived notes appear here" />
      )}
    </div>
  );
};

export default Archive;
