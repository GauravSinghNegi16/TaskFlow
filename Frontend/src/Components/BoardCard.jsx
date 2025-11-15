import { useNavigate } from "react-router-dom";

export default function BoardCard({ board }) {
  const navigate = useNavigate();

  // Random gradient generator
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-indigo-500",
    "from-rose-500 to-orange-500",
    "from-teal-500 to-cyan-500",
    "from-fuchsia-500 to-purple-600",
    "from-amber-500 to-yellow-500",
  ];
  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="
        w-full max-w-xs sm:max-w-sm rounded-2xl shadow-md border border-gray-200 
        cursor-pointer overflow-hidden group transition-all
        hover:shadow-xl hover:-translate-y-1 active:scale-95 bg-white
      "
    >
      {/* Gradient Top Area */}
      <div
        className={`h-28 sm:h-32 w-full bg-gradient-to-br ${randomGradient}`}
      ></div>

      {/* Board Name */}
      <div className="px-4 py-3 text-gray-800 font-semibold text-base sm:text-lg truncate">
        {board.name}
      </div>
    </div>
  );
}
