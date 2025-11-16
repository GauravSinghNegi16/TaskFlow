import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { RxCross2 } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import CardItem from "../Components/CardItem";
import useSocket from "../hooks/useSocket";

export default function BoardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newCardText, setNewCardText] = useState("");
  const [activeListId, setActiveListId] = useState(null);
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const {
    boardName,
    lists,
    cards,
    loadBoard,
    updateCard,
    deleteCard,
    createCard,
    createList,
    deleteList,
  } = useBoard();

  useEffect(() => {
    if (id) loadBoard(id);
  }, [id]);


  const handleRealtime = useCallback(
    (event) => {
      console.log("🔥 Real-time event received:", event);

      if (!event || event.boardId !== id) return;

      switch (event.type) {
        case "card:created":
        case "card:updated":
        case "card:deleted":
        case "list:created":
          loadBoard(id);
          break;

        default:
          break;
      }
    },
    [id, loadBoard]
  );

  useSocket(id, handleRealtime);

  const filteredLists = lists.filter(
    (l) => l.name.toLowerCase() !== "trello starter guide"
  );

  const getListCardsSorted = (listId) =>
    cards
      .filter((c) => c.idList === listId)
      .map((c) => ({ ...c, pos: parseFloat(c.pos || 0) }))
      .sort((a, b) => (a.pos || 0) - (b.pos || 0));

  const computeNewPos = (destListId, destIndex) => {
    const listCards = getListCardsSorted(destListId);

    if (listCards.length === 0) return 65536;

    if (destIndex <= 0) {
      const firstPos = listCards[0].pos || 65536;
      return firstPos / 2;
    }

    if (destIndex >= listCards.length) {
      const lastPos = listCards[listCards.length - 1].pos || 65536;
      return lastPos + 65536;
    }

    const before = listCards[destIndex - 1].pos || 0;
    const after = listCards[destIndex].pos || before + 65536;
    return (before + after) / 2;
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const destListId = destination.droppableId;
    const destIndex = destination.index;

    const newPos = computeNewPos(destListId, destIndex);

    updateCard(draggableId, {
      idList: destListId,
      pos: newPos,
      boardId: id,
    }).catch(() => loadBoard(id));
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{
        background: "linear-gradient(135deg, #c084fcd5, #ff62b8e4, #7f62ffe4)",
        backgroundSize: "200% 200%",
        animation: "gradientMove 10s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
        `}
      </style>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl sm:text-3xl text-gray-700 hover:text-black"
        >
          <IoArrowBack />
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold truncate">
          {boardName || "Board"}
        </h1>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 items-start scrollbar-hide">
          {filteredLists.map((list) => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="
                    w-64 sm:w-72 bg-white rounded-xl p-4 shadow-md 
                    border border-gray-200 flex-shrink-0 group
                  "
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg truncate">
                      {list.name}
                    </h3>

                    {typeof deleteList === "function" && (
                      <button
                        onClick={() => deleteList(list.id)}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                          transition text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {getListCardsSorted(list.id).map((card, index) => (
                      <CardItem
                        key={card.id}
                        card={card}
                        index={index}
                        updateCard={updateCard}
                        deleteCard={deleteCard}
                      />
                    ))}

                    {provided.placeholder}
                  </div>

                  {activeListId === list.id ? (
                    <div className="mt-3">
                      <textarea
                        id={`input-${list.id}`}
                        className="w-full p-2 border rounded-md text-sm 
                          focus:ring-primary outline-none resize-none"
                        rows="2"
                        placeholder="Enter a title..."
                        value={newCardText}
                        onChange={(e) => setNewCardText(e.target.value)}
                      />

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          className="bg-primary text-white px-3 py-1 rounded shadow hover:bg-primary/80"
                          onClick={() => {
                            if (!newCardText.trim()) return;
                            createCard(list.id, newCardText.trim(), id);
                            setNewCardText("");
                            setActiveListId(null);
                          }}
                        >
                          Add
                        </button>

                        <button
                          onClick={() => {
                            setActiveListId(null);
                            setNewCardText("");
                          }}
                          className="text-gray-600 text-xl"
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="mt-3 text-sm text-gray-700 hover:text-primary"
                      onClick={() => {
                        setActiveListId(list.id);
                        setTimeout(() => {
                          document.getElementById(`input-${list.id}`)?.focus();
                        }, 50);
                      }}
                    >
                      + Add card
                    </button>
                  )}
                </div>
              )}
            </Droppable>
          ))}

          <div className="w-64 sm:w-72 flex-shrink-0">
            {addingList ? (
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-300">
                <input
                  className="w-full p-2 border rounded-md text-sm focus:border-primary"
                  placeholder="List title…"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />

                <div className="flex items-center gap-3 mt-2">
                  <button
                    className="bg-primary text-white px-3 py-1 rounded shadow hover:bg-primary/80"
                    onClick={() => {
                      if (!newListName.trim()) return;
                      createList(newListName.trim(), id);
                      setNewListName("");
                      setAddingList(false);
                    }}
                  >
                    Add List
                  </button>

                  <button
                    onClick={() => {
                      setAddingList(false);
                      setNewListName("");
                    }}
                    className="text-gray-600 text-xl"
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingList(true)}
                className="w-full bg-white/80 hover:bg-white border border-gray-300 
                  rounded-xl p-4 shadow-sm text-left transition"
              >
                + Add another list
              </button>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
