import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Search } from "lucide-react";

export default function GameLibraryApp() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");

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

  const filteredGames = games.filter((g) => {
    const matchesSearch = g.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPlatform =
      platformFilter === "ALL" ||
      g.console === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  const ps = games.filter((g) => g.console === "PS").length;
  const xbox = games.filter((g) => g.console === "XBOX").length;
  const sw = games.filter((g) => g.console === "SWITCH").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      {/* Hero Banner */}
      <div className="relative h-72 rounded-3xl overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
          alt="Gaming Banner"
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Gamepad2
              className="text-purple-400"
              size={40}
            />

            <h1 className="text-5xl font-bold text-purple-400">
              My Game Vault
            </h1>
          </motion.div>

          <p className="text-gray-300 mt-4 text-lg">
            Track your legendary collection 🎮
          </p>
        </div>
      </div>

      {/* Platform Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "PlayStation",
            count: ps,
            value: "PS",
            logo: "🔵",
          },
          {
            label: "Xbox",
            count: xbox,
            value: "XBOX",
            logo: "🟢",
          },
          {
            label: "Switch",
            count: sw,
            value: "SWITCH",
            logo: "🔴",
          },
        ].map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            onClick={() =>
              setPlatformFilter(
                platformFilter === item.value
                  ? "ALL"
                  : item.value
              )
            }
            className={`bg-gradient-to-br from-gray-800 to-gray-900 border rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center transition ${
              platformFilter === item.value
                ? "border-purple-500 ring-2 ring-purple-500"
                : "border-gray-700"
            }`}
          >
            <div className="text-4xl mb-2">
              {item.logo}
            </div>

            <p className="text-gray-400 text-sm">
              {item.label}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {item.count}
            </h2>
          </motion.button>
        ))}
      </div>

      {/* Active Filter */}
      {platformFilter !== "ALL" && (
        <div className="mb-6 text-purple-400 font-medium">
          Filtering: {platformFilter}

          <button
            onClick={() => setPlatformFilter("ALL")}
            className="ml-3 text-white underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-8 max-w-xl">
        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          className="w-full pl-10 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search your collection..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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