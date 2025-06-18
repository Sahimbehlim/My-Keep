import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Header, SideBar, NoteBox } from "../components/Home/common/index";
import { AllNotes, Archive, Bin } from "../components/Home/index";
import { useUser } from "../context/userContext";
import { NoteProvider } from "../context/noteContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [hash, setHash] = useState(window.location.hash);
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);
  const [editedNote, setEditedNote] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { token } = useUser();

  useEffect(() => {
    if (!token) return;

    const getAllNotes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { allNotes, userInfo } = response.data;
        setLoggedInUser(userInfo);
        setNotes(allNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    getAllNotes();
  }, [token]);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const renderComponent = () => {
    switch (hash) {
      case "#home":
        return <AllNotes />;
      case "#archive":
        return <Archive />;
      case "#trash":
        return <Bin />;
      default:
        return <AllNotes />;
    }
  };

  return (
    <NoteProvider
      value={{
        hash,
        isOpenSideBar,
        setIsOpenSideBar,
        notes,
        setNotes,
        editedNote,
        setEditedNote,
        loggedInUser,
      }}
    >
      <section className="w-full min-h-screen bg-white text-gray-800 relative">
        <ToastContainer />
        <Header />
        <div className="relative">
          <SideBar />
          {renderComponent()}
        </div>

        {editedNote && (
          <div className="w-full h-screen fixed top-0 left-0 flex justify-center items-center bg-[#00000090] z-10 px-4">
            <NoteBox />
          </div>
        )}
      </section>
    </NoteProvider>
  );
};

export default Home;
