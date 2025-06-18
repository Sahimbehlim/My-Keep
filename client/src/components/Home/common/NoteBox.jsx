import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { toast } from "react-toastify";
import { LuPin } from "react-icons/lu";
import { Btn } from "./index";
import { useNotes } from "../../../context/noteContext";
import { useUser } from "../../../context/userContext";

const NoteBox = () => {
  const [isFocus, setIsFocus] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPinned: false,
  });

  const { token } = useUser();
  const { setNotes, editedNote, setEditedNote } = useNotes();
  const noteBoxRef = useRef(null);

  useEffect(() => {
    if (editedNote) {
      setIsFocus(true);
      setFormData({
        title: editedNote.title,
        description: editedNote.description,
        isPinned: editedNote.isPinned,
        isArchive: editedNote.isArchive,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (noteBoxRef.current && !noteBoxRef.current.contains(e.target)) {
        resetForm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    if (editedNote) {
      setEditedNote(null);
    }
    setIsFocus(false);
    setFormData({ title: "", description: "", isPinned: false });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePin = () => {
    setFormData((prevData) => ({ ...prevData, isPinned: !prevData.isPinned }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const url = editedNote
        ? `http://localhost:3000/api/notes/${editedNote._id}`
        : "http://localhost:3000/api/notes";

      const method = editedNote ? "patch" : "post";
      const { data } = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) =>
        editedNote
          ? prevNotes.map((note) =>
              note._id === data.updatedNote._id ? data.updatedNote : note
            )
          : [...prevNotes, data.newNote]
      );

      if (editedNote?.isArchive && data.updatedNote.isPinned) {
        toast("Note unarchived & pinned", {
          position: "bottom-left",
          autoClose: 1000,
          pauseOnHover: false,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }

    resetForm();
  };

  return (
    <form
      ref={noteBoxRef}
      onSubmit={submitHandler}
      className="bg-white shadow-custom max-w-2xl mx-auto w-full rounded-md overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <input
          onFocus={() => setIsFocus(true)}
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChanges}
          className={clsx(
            "w-full py-2 focus:outline-none px-4 font-medium placeholder:text-gray-800  placeholder:text-sm",
            isFocus && "placeholder:text-base placeholder:text-gray-600"
          )}
          required
          placeholder={`${isFocus ? "Title..." : "Take a note..."}`}
        />
        {isFocus && (
          <Btn
            icon={
              <LuPin
                size={20}
                className={clsx(formData.isPinned && "fill-black")}
              />
            }
            handler={togglePin}
            className="size-9 mr-3 mt-1"
          />
        )}
      </div>

      {isFocus && (
        <>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChanges}
            className="w-full pt-3 px-4 placeholder:text-gray-700 placeholder:text-sm focus:outline-none placeholder:font-medium resize-none"
            placeholder="Take a note..."
          />
          <div className="px-2 mb-1 flex">
            <button
              type="submit"
              className="px-4 py-2 rounded-md ml-auto w-max hover:bg-gray-100 text-sm font-medium"
            >
              {editedNote ? "Update" : "Save"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default NoteBox;
