import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Search } from "lucide-react";

export default function GameLibraryApp() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1G66a7iv9rM3W5oXpQ6OiWm34B3vPd_-aj3pARmHBg6k/1")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((g, i) => ({
          id: i,
          name: g.Name,
          console: g.Console,
          collector: String(g.Collector).toLowerCase() === "true"
        })).sort((a, b) => a.name.localeCompare(b.name));
        setGames(formatted);
      });
  }, []);

  const filteredGames = games.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const ps = games.filter(g => g.console === "PS").length;
  const xbox = games.filter(g => g.console === "XBOX").length;
  const sw = games.filter(g => g.console === "SWITCH").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <Gamepad2 className="text-purple-400" />
        <h1 className="text-4xl font-bold">Shared Game Vault</h1>
      </motion.div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { label: "PlayStation", count: ps },
          { label: "Xbox", count: xbox },
          { label: "Switch", count: sw }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-3xl font-bold mt-2">{item.count}</h2>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
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
                <td className="p-4 font-medium">{g.name}</td>
                <td className="p-4">{g.console}</td>
                <td className="p-4">
                  {g.collector ? (
                    <span className="text-yellow-400">⭐ Collector</span>
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