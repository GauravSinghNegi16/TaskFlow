import React, { useState } from "react";
import { assets } from "../assets/assets";
import { IoIosAdd } from "react-icons/io";
import { useBoard } from "../context/BoardContext";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
    const [creating, setCreating] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const { createBoard } = useBoard();
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!boardTitle.trim()) return;

        const newBoard = await createBoard(boardTitle.trim());
        if (!newBoard) return;

        setBoardTitle("");
        setCreating(false);
        setMenuOpen(false);

        navigate(`/board/${newBoard.id}`);
    };

    return (
        <>
            {/* ---------------- NAVBAR ---------------- */}
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
                
                {/* Left → Logo */}
                <div className="flex items-center justify-center">
                    <img
                        src={assets.logo}
                        className="w-40 sm:w-48"
                        alt="logo"
                    />
                </div>

                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    {!creating ? (
                        <button
                            onClick={() => setCreating(true)}
                            className="px-6 py-2 bg-primary text-white rounded-full flex items-center gap-1"
                        >
                            Create new board 
                            <IoIosAdd className="text-xl" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow border">
                            <input
                                autoFocus
                                className="px-3 py-1 outline-none bg-transparent"
                                placeholder="Board name..."
                                value={boardTitle}
                                onChange={(e) => setBoardTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />

                            <button
                                onClick={handleCreate}
                                className="bg-primary text-white px-4 py-1 rounded-full"
                            >
                                Create
                            </button>

                            <button
                                onClick={() => {
                                    setBoardTitle("");
                                    setCreating(false);
                                }}
                                className="text-gray-500 hover:text-black text-xl px-2"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="sm:hidden text-3xl text-gray-700"
                    onClick={() => setMenuOpen(true)}
                >
                    <HiMenuAlt3 />
                </button>
            </div>

            {/* ---------------- MOBILE SIDEBAR ---------------- */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <button
                        className="text-2xl"
                        onClick={() => setMenuOpen(false)}
                    >
                        <RxCross2 />
                    </button>
                </div>

                <div className="px-4 py-4 flex flex-col gap-4">

                    {/* Create Board UI Inside Sidebar */}
                    {!creating ? (
                        <button
                            onClick={() => setCreating(true)}
                            className="px-5 py-2 bg-primary text-white rounded-full flex items-center justify-center gap-1"
                        >
                            Create new board 
                            <IoIosAdd className="text-xl" />
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <input
                                autoFocus
                                className="px-3 py-2 rounded-md border outline-none"
                                placeholder="Board name..."
                                value={boardTitle}
                                onChange={(e) => setBoardTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />

                            <button
                                onClick={handleCreate}
                                className="bg-primary text-white py-2 rounded-md"
                            >
                                Create
                            </button>

                            <button
                                onClick={() => {
                                    setBoardTitle("");
                                    setCreating(false);
                                }}
                                className="text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------- BACKDROP ---------------- */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Navbar;
