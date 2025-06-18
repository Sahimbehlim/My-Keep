import React, { useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { toast } from "react-toastify";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { RiDeleteBin6Line, RiEditCircleLine } from "react-icons/ri";
import { MdRestoreFromTrash, MdDeleteForever } from "react-icons/md";
import { LuPin } from "react-icons/lu";
import { Btn } from "./index";
import { useNotes } from "../../../context/noteContext";
import { useUser } from "../../../context/userContext";

const SingleNote = ({ note }) => {
  const [isHover, setIsHover] = useState(false);
  const { token } = useUser();
  const { setNotes, setEditedNote } = useNotes();

  const toastTheme = {
    position: "bottom-left",
    autoClose: 1000,
    pauseOnHover: false,
    theme: "dark",
  };

  const toggleNoteStatus = async (name, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/notes/${note._id}/toggle-status`,
        { status, name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n._id === response.data.toggledResult._id ? { ...n, ...status } : n
        )
      );

      const messages = {
        pin: status.isPinned ? "Note pinned" : "Note unpinned",
        eye: status.isArchive ? "Note archived" : "Note unarchived",
        bin: status.isBinned ? "Note binned" : "Note restored",
      };

      toast(messages[name], toastTheme);
    } catch (error) {
      console.error("Error toggling note status:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!window.confirm("Delete note forever?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/notes/${note._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== note._id));
      toast("Note deleted", toastTheme);
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  };

  return (
    <div
      onMouseOverCapture={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex flex-col gap-y-3 bg-white py-2.5 px-4 rounded-md border hover:shadow-custom transition-all duration-500 h-full"
    >
      <div className="relative">
        <h2 className="font-medium break-words max-w-[90%]">{note.title}</h2>
        {!note.isBinned && (
          <Btn
            handler={() =>
              toggleNoteStatus("pin", {
                isPinned: !note.isPinned,
                isArchive: false,
              })
            }
            icon={
              <LuPin
                size={18}
                className={clsx({ "fill-black": note.isPinned })}
              />
            }
            className={clsx(
              "absolute -right-2 -top-1",
              isHover ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </div>
      <p className="text-sm text-gray-800 break-words">{note.description}</p>
      <div className="flex items-center w-max ms-auto mt-auto">
        {!note.isBinned && (
          <Btn
            handler={() => setEditedNote(note)}
            icon={
              <RiEditCircleLine
                className={clsx(isHover ? "opacity-100" : "opacity-0")}
              />
            }
          />
        )}

        <Btn
          handler={
            note.isBinned
              ? handleDeleteNote
              : () =>
                  toggleNoteStatus("eye", {
                    isArchive: !note.isArchive,
                    isPinned: false,
                  })
          }
          icon={
            note.isBinned ? (
              <MdDeleteForever size={18} />
            ) : note.isArchive ? (
              <BiArchiveOut size={16} />
            ) : (
              <BiArchiveIn size={16} />
            )
          }
          className={clsx(isHover ? "opacity-100" : "opacity-0")}
        />

        <Btn
          handler={() =>
            toggleNoteStatus("bin", {
              isBinned: !note.isBinned,
              isArchive: !note.isArchive,
              isPinned: false,
            })
          }
          icon={
            note.isBinned ? (
              <MdRestoreFromTrash size={18} />
            ) : (
              <RiDeleteBin6Line size={15} />
            )
          }
          className={clsx(isHover ? "opacity-100" : "opacity-0")}
        />
      </div>
    </div>
  );
};

export default SingleNote;
