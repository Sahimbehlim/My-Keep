import { createContext, useContext } from "react";

// Create the context
const noteContext = createContext({
  notes: [],
  setNotes: () => {},
  hash: "",
  setHash: () => {},
  isOpenSideBar: false,
  setIsOpenSideBar: () => {},
  editedNote: null,
  setEditedNote: () => {},
  loggedInUser: null,
});

export const NoteProvider = noteContext.Provider;

// Custom hook to use the context
export const useNotes = () => {
  return useContext(noteContext);
};
