import React from "react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { EmptyBox, SingleNote, GridLayout } from "./common/index";
import { useNotes } from "../../context/noteContext";
import { useUser } from "../../context/userContext";

const Bin = () => {
  const { token } = useUser();
  const { notes, setNotes } = useNotes();

  const emptyBinHandler = async () => {
    const confirmDelete = window.confirm(
      "Empty bin? All notes in Recycle Bin will be permanently deleted."
    );

    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:3000/api/notes/bin/empty", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => !note.isBinned));
    } catch (error) {
      console.error("Error deleting all notes:", error);
    }
  };

  const binnedNotes = notes.reduce((acc, note) => {
    if (note.isBinned) acc.push(note);
    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-y-4 pl-24 pt-20 pe-4 min-h-screen">
      {binnedNotes.length > 0 && (
        <button
          onClick={emptyBinHandler}
          className="hover:bg-gray-50 px-5 py-2 rounded-sm text-blue-600 font-medium text-sm w-max transition-all duration-100 ms-auto"
        >
          Empty bin
        </button>
      )}

      {binnedNotes.length > 0 ? (
        <GridLayout>
          {binnedNotes.map((note) => (
            <SingleNote key={note._id} note={note} />
          ))}
        </GridLayout>
      ) : (
        <EmptyBox Icon={RiDeleteBin6Line} text="No notes in Recycle Bin" />
      )}
    </div>
  );
};

export default Bin;
