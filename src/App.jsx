import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function GameLibraryApp() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");

  // Proper case formatter
  const toTitleCase = (str) => {
    return str
      ?.trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word) => {
        const smallWords = ["of", "the", "and", "in", "on"];
        if (smallWords.includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  // Fetch Google Sheet data
  useEffect(() => {
    fetch(
      "https://opensheet.elk.sh/1G66a7iv9rM3W5oXpQ6OiWm34B3vPd_-aj3pARmHBg6k/1"
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .map((g, i) => ({
            id: i,
            name: toTitleCase(g.Name),
            console: g.Console,
            collector:
              String(g.Collector).toLowerCase() === "true",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setGames(formatted);
      });
  }, []);

  // Filter logic
  const filteredGames = games.filter((g) => {
    const matchesSearch = g.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPlatform =
      platformFilter === "ALL" ||
      g.console === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  const psCount = games.filter(
    (g) => g.console === "PS"
  ).length;

  const xboxCount = games.filter(
    (g) => g.console === "XBOX"
  ).length;

  const switchCount = games.filter(
    (g) => g.console === "SWITCH"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      {/* Hero Banner */}
      <div className="relative h-96 rounded-3xl overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
          alt="Gaming Banner"
          className="w-full h-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">

          <h1 className="text-5xl md:text-6xl font-bold text-purple-400 mb-4">
            My Game Vault
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Track your legendary collection across platforms
          </p>

          {/* Clickable Platform Logos */}
          <div className="flex flex-wrap justify-center gap-8">

            {/* PlayStation */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() =>
                setPlatformFilter(
                  platformFilter === "PS"
                    ? "ALL"
                    : "PS"
                )
              }
              className={`p-5 rounded-2xl backdrop-blur-md ${
                platformFilter === "PS"
                  ? "bg-purple-600"
                  : "bg-white/10"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg"
                alt="PlayStation"
                className="h-12 w-12 object-contain"
              />
              <p className="mt-2 text-sm">
                {psCount} Games
              </p>
            </motion.button>

            {/* Xbox */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() =>
                setPlatformFilter(
                  platformFilter === "XBOX"
                    ? "ALL"
                    : "XBOX"
                )
              }
              className={`p-5 rounded-2xl backdrop-blur-md ${
                platformFilter === "XBOX"
                  ? "bg-green-600"
                  : "bg-white/10"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg"
                alt="Xbox"
                className="h-12 w-12 object-contain"
              />
              <p className="mt-2 text-sm">
                {xboxCount} Games
              </p>
            </motion.button>

            {/* Switch */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() =>
                setPlatformFilter(
                  platformFilter === "SWITCH"
                    ? "ALL"
                    : "SWITCH"
                )
              }
              className={`p-5 rounded-2xl backdrop-blur-md ${
                platformFilter === "SWITCH"
                  ? "bg-red-600"
                  : "bg-white/10"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo_Switch_logo.svg"
                alt="Switch"
                className="h-12 w-12 object-contain"
              />
              <p className="mt-2 text-sm">
                {switchCount} Games
              </p>
            </motion.button>

          </div>
        </div>
      </div>

      {/* Active Filter */}
      {platformFilter !== "ALL" && (
        <div className="mb-6 text-purple-400 font-medium text-center">
          Showing: {platformFilter}

          <button
            onClick={() => setPlatformFilter("ALL")}
            className="ml-3 underline text-white"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-8 max-w-xl mx-auto">
        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          className="w-full pl-10 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search your collection..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900/70 backdrop-blur border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="p-4">Game</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Edition</th>
            </tr>
          </thead>

          <tbody>
            {filteredGames.map((g) => (
              <tr
                key={g.id}
                className="border-t border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="p-4 font-medium">
                  {g.name}
                </td>

                <td className="p-4">
                  {g.console}
                </td>

                <td className="p-4">
                  {g.collector ? (
                    <span className="text-yellow-400">
                      ⭐ Collector
                    </span>
                  ) : (
                    "Standard"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}