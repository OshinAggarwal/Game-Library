import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Search } from "lucide-react";

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
        })).sort((a,b)=> a.name.localeCompare(b.name));
        setGames(formatted);
      });
  }, []);

  const filteredGames = games.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const ps = games.filter(g=>g.console==="PS").length;
  const xbox = games.filter(g=>g.console==="XBOX").length;
  const sw = games.filter(g=>g.console==="SWITCH").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <motion.div initial={{opacity:0,y:-30}} animate={{opacity:1,y:0}} className="flex gap-3 mb-8">
        <Gamepad2 className="text-purple-400"/>
        <h1 className="text-4xl font-bold">Shared Game Vault</h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl">PS: {ps}</div>
        <div className="bg-gray-800 p-4 rounded-xl">Xbox: {xbox}</div>
        <div className="bg-gray-800 p-4 rounded-xl">Switch: {sw}</div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400"/>
        <input
          className="w-full pl-10 p-3 bg-gray-800 rounded"
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      <div className="bg-gray-900 p-4 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400">
              <th>Name</th>
              <th>Console</th>
              <th>Edition</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map(g=>(
              <tr key={g.id} className="border-b border-gray-700">
                <td>{g.name}</td>
                <td>{g.console}</td>
                <td>{g.collector ? "⭐ Collector" : "Standard"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
