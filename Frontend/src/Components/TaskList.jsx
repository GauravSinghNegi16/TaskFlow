import React from "react";
import BoardCard from "./BoardCard";

const TaskList = ({ userBoards, loadBoard }) => {
    return (
        <div className="max-w-6xl mx-auto my-10 px-4">

            <div
                className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3 
                    gap-6 
                    place-items-center
                "
            >
                {userBoards.map((board) => (
                    <BoardCard
                        key={board.id}
                        board={board}
                        onClick={() => loadBoard(board.id)}
                    />
                ))}
            </div>

        </div>
    );
};

export default TaskList;
