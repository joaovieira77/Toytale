import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

export default function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Get all conversations for this user
        const res = await fetch(`http://localhost:3032/conversations/${userId}`);
        const conversations = await res.json();
        
        if (conversations.length === 0) {
          setConversations([]);
          return;
        }

        // Get all users to match partner IDs with user info
        const userRes = await fetch("http://localhost:3032/api/all-users");
        const users = await userRes.json();

        // Enrich conversations with user info
        const enriched = conversations.map(conv => {
          const otherUser = users.find(u => u._id === conv.partnerId);
          
          // Handle different name formats
          let displayName = "Unknown";
          if (otherUser) {
            if (otherUser.name) {
              displayName = otherUser.name;
            } else if (otherUser.firstName || otherUser.lastName) {
              displayName = `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim();
            }
          }
          
          return {
            id: conv.partnerId,
            name: displayName,
            profileImage: otherUser?.profileImage || "/purple-butterfly.jpg",
            message: conv.lastMessage || "No messages yet",
            time: conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString() : "",
            timestamp: conv.timestamp ? new Date(conv.timestamp).getTime() : 0,
          };
        });

        // Sort by most recent message
        enriched.sort((a, b) => b.timestamp - a.timestamp);

        setConversations(enriched);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err.message);
      }
    };

    if (userId) fetchConversations();
  }, [userId]);

  const filteredConversations = conversations.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans pb-20">
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 w-full bg-white pt-5 pb-4 shadow-md">
        <div className="flex items-center justify-center">
          <img src="/toytalelogo.png" alt="Toytale Logo" className="h-14 md:h-20 object-contain" />
        </div>
      </div>

      {/*  Search */}
      <h2 className="text-2xl mt-5 font-semibold text-center">Messages</h2>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search for conversations..."
          className="w-full border px-4 py-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/*  Conversation List */}
      <div className="space-y-4 px-4">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-gray-500">
            No conversations yet.
          </p>
        ) : (
          filteredConversations.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/messages/${user.id}`)}
              className="flex items-center gap-4 p-4 bg-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-stone-300 transition"
            >
              <img 
                src={user.profileImage} 
                alt={user.name}
                className="w-12 h-12 rounded-full bg-gray-300 object-cover border-2 border-gray-200"
              />
              <div>
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-sm text-gray-700">{user.message}</p>
                <p className="text-xs text-gray-500 mt-1">{user.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/*  Bottom Navigation */}
      <NavBar />
    </div>
  );
}
