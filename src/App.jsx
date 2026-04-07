import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Search } from "lucide-react";

export default function GameLibraryApp() {
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem("games");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ name: "", console: "PS", collector: false });
  const [search, setSearch] = useState("");

  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const addGame = () => {
    if (!form.name) return;

    setGames([
      ...games,
      { ...form, name: toTitleCase(form.name), id: Date.now() },
    ]);

    setForm({ name: "", console: "PS", collector: false });
  };

  const removeGame = (id) => {
    setGames(games.filter((g) => g.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  const filteredGames = games
    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const psCount = games.filter((g) => g.console === "PS").length;
  const xboxCount = games.filter((g) => g.console === "XBOX").length;
  const switchCount = games.filter((g) => g.console === "SWITCH").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <Gamepad2 className="text-purple-400" />
        <h1 className="text-4xl font-extrabold tracking-tight">My Game Vault</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[{ label: "PlayStation", count: psCount }, { label: "Xbox", count: xboxCount }, { label: "Switch", count: switchCount }].map((c, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl shadow-xl">
            <p className="text-gray-400">{c.label}</p>
            <h2 className="text-4xl font-bold mt-2">{c.count}</h2>
          </motion.div>
        ))}
      </div>

      <div className="mb-8 bg-gray-900/70 backdrop-blur border border-gray-700 p-6 rounded-2xl shadow-lg space-y-4">
        <input className="w-full p-3 rounded bg-gray-800 border border-gray-700" placeholder="Enter game name..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <select value={form.console} onChange={(e) => setForm({ ...form, console: e.target.value })} className="w-full p-3 rounded bg-gray-800 border border-gray-700">
          <option value="PS">PlayStation</option>
          <option value="XBOX">Xbox</option>
          <option value="SWITCH">Switch</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.collector} onChange={(e) => setForm({ ...form, collector: e.target.checked })}/>
          <Trophy size={16}/> Collector's Edition
        </label>
        <button onClick={addGame} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-xl font-semibold">Add Game</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
        <input className="w-full pl-10 p-3 rounded bg-gray-800 border border-gray-700" placeholder="Search your collection..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
      </div>

      <div className="bg-gray-900/70 backdrop-blur border border-gray-700 p-4 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-3">Game</th>
              <th className="p-3">Platform</th>
              <th className="p-3">Edition</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-800/40">
                <td className="p-3">{game.name}</td>
                <td className="p-3">{game.console}</td>
                <td className="p-3">{game.collector ? "⭐ Collector" : "Standard"}</td>
                <td className="p-3">
                  <button onClick={() => removeGame(game.id)} className="text-red-400">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
