import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BoardContext = createContext();
export const useBoard = () => useContext(BoardContext);

export function BoardProvider({ children }) {
  const [userBoards, setUserBoards] = useState([]);
  const [boardId, setBoardId] = useState("");
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [boardName, setBoardName] = useState("");

  const API = import.meta.env.VITE_API_BASE;

  /* ----------------------------------------------------
     LOAD ALL BOARDS
  ------------------------------------------------------*/
  const allLoadBoards = async () => {
    try {
      const res = await axios.get(`${API}/api/boards`);
      setUserBoards(res.data);
    } catch (err) {
      console.error("LOAD BOARDS ERROR:", err);
    }
  };

  /* ----------------------------------------------------
     LOAD SINGLE BOARD (lists + cards + name)
  ------------------------------------------------------*/
  const loadBoard = async (id) => {
    try {
      const res = await axios.get(`${API}/api/boards/${id}/data`);

      setBoardId(id);
      setBoardName(res.data.board?.name || "Board");

      setLists(res.data.lists);

      const sortedCards = res.data.cards
        .map((c) => ({ ...c, pos: c.pos || 0 }))
        .sort((a, b) => a.pos - b.pos);

      setCards(sortedCards);
    } catch (err) {
      console.error("LOAD BOARD ERROR:", err);
      alert("Failed to load board");
    }
  };

  /* ----------------------------------------------------
     CREATE CARD
  ------------------------------------------------------*/
  const createCard = async (listId, name) => {
    try {
      const res = await axios.post(`${API}/api/tasks`, {
        listId,
        name,
      });

      setCards((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("CREATE CARD ERROR:", err);
      alert("Failed to create card");
    }
  };

  /* ----------------------------------------------------
     UPDATE CARD (drag, rename, move)
     - MUST USE { idList, pos }
  ------------------------------------------------------*/
  const updateCard = async (cardId, updates) => {
    try {
      await axios.put(`${API}/api/tasks/${cardId}`, updates);

      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId ? { ...c, ...updates } : c
        )
      );
    } catch (err) {
      console.error("UPDATE CARD ERROR:", err);
      alert("Failed to update card");
    }
  };

  /* ----------------------------------------------------
     DELETE CARD
  ------------------------------------------------------*/
  const deleteCard = async (cardId) => {
    try {
      await axios.delete(`${API}/api/tasks/${cardId}`);

      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      console.error("DELETE CARD ERROR:", err);
      alert("Failed to delete card");
    }
  };

  /* ----------------------------------------------------
     CREATE LIST
  ------------------------------------------------------*/
  const createList = async (name) => {
    try {
      const res = await axios.post(`${API}/api/lists`, {
        name,
        boardId,
      });

      setLists((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("CREATE LIST ERROR:", err);
      alert("Failed to create list");
    }
  };

  /* ----------------------------------------------------
     UPDATE BOARD NAME (Rename board)
  ------------------------------------------------------*/
  const updateBoardName = async (newName) => {
    try {
      await axios.put(`${API}/api/boards/${boardId}`, {
        name: newName,
      });

      setBoardName(newName);

      // update in list view immediately
      setUserBoards((prev) =>
        prev.map((b) =>
          b.id === boardId ? { ...b, name: newName } : b
        )
      );
    } catch (err) {
      console.error("RENAME BOARD ERROR:", err);
      alert("Failed to rename board");
    }
  };


  const createBoard = async (name) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/boards`,
        { name }
      );

      setUserBoards((prev) => [...prev, res.data]);

      return res.data;
    } catch (err) {
      console.error(err);
      alert("Failed to create board");
    }
  };


  /* ----------------------------------------------------
     INIT
  ------------------------------------------------------*/
  useEffect(() => {
    allLoadBoards();
  }, []);

  return (
    <BoardContext.Provider
      value={{
        userBoards,
        boardId,
        boardName,
        lists,
        cards,
        loadBoard,
        createCard,
        updateCard,
        deleteCard,
        createList,
        updateBoardName,
        createBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
