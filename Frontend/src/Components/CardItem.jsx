import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

function CardItem({ card, index, updateCard, deleteCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(card.name);

  const saveEdit = () => {
    if (value.trim() && value !== card.name) {
      updateCard(card.id, { name: value.trim() });
    }
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative p-3 rounded-md shadow bg-white mb-3 
            transition-all cursor-grab active:cursor-grabbing
            ${snapshot.isDragging ? "bg-gray-100 scale-[1.03] shadow-lg" : ""}
          `}
          style={provided.draggableProps.style}
        >
          {/* Inline Edit Input */}
          {isEditing ? (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          ) : (
            <p
              className="font-medium break-words whitespace-normal text-sm sm:text-base"
              onClick={() => setIsEditing(true)}
            >
              {card.name}
            </p>
          )}

          {/* Action Icons */}
          {!isEditing && (
            <div
              className="
                absolute top-2 right-2 flex gap-3 sm:gap-2
                opacity-100 sm:opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
            >
              {/* EDIT */}
              <FiEdit3
                size={18}
                className="text-gray-600 hover:text-blue-600 cursor-pointer active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              />

              {/* DELETE */}
              <FiTrash2
                size={18}
                className="text-gray-600 hover:text-red-600 cursor-pointer active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(card.id);
                }}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(CardItem);
