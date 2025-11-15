import React from "react";
import { assets } from "../assets/assets.js";

const Header = ({ userBoards, loadBoard }) => {
  return (
    <div className="relative overflow-hidden">

      <div className="max-w-7xl mx-auto text-center px-4 pt-10 sm:pt-20 pb-20">

        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm border border-primary/40 bg-primary/10 text-primary">
            <span>Organize smarter with new features</span>
            <img src={assets.star_icon} className="w-4 h-4" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          Your own <span className="text-primary">Task Board</span>
          <br className="hidden sm:block" />
          management platform
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-center max-w-xl mx-auto text-gray-600 text-sm sm:text-base">
          Create, organize and manage all your tasks in one place.
          Simple, clean & powerful workflow for your daily productivity.
        </p>

      </div>
    </div>
  );
};

export default Header;
