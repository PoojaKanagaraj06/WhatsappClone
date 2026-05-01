function ChatList({ users, loading, selectedUserId, onSelectUser, searchQuery, onSearchChange, onAddContact, unreadCounts = {}, lastMessages = {}, currentUserId }) {
  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get last message preview
  const getLastMessagePreview = (user) => {
    const lastMessage = lastMessages[user._id];
    if (!lastMessage) return "Tap to chat";

    const isFromCurrentUser = lastMessage.sender === currentUserId;
    const messagePrefix = isFromCurrentUser ? "You: " : "";
    const truncatedText = lastMessage.text.length > 40 ? lastMessage.text.slice(0, 40) + "..." : lastMessage.text;

    return messagePrefix + truncatedText;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-3">Chats</h1>
        
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-gray-200"
          />
          <button
            type="button"
            onClick={onAddContact}
            title="Add new contact"
            className="w-10 h-10 bg-[#25d366] text-white rounded-full flex items-center justify-center hover:bg-[#20bd5c] transition font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500">
              {searchQuery ? "No contacts found" : "No contacts yet"}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isActive = selectedUserId === user._id;
            const initials = user.username.slice(0, 2).toUpperCase();
            const unreadCount = unreadCounts[user._id] || 0;

            return (
              <button
                key={user._id}
                type="button"
                onClick={() => onSelectUser(user)}
                className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition ${
                  isActive ? "bg-[#f0f2f5] border-l-4 border-l-[#25d366]" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9fdd3] font-semibold text-[#075e54] flex-shrink-0 shadow-sm">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="truncate text-sm font-semibold text-gray-900">{user.username}</h2>
                  <div className="ml-3 shrink-0 flex items-center gap-2">
                    {unreadCount > 0 && (
                      <div className="bg-[#25d366] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </div>
                    )}
                    <span className="text-xs text-gray-400">Now</span>
                  </div>
                  </div>
                  <p className="truncate text-sm text-gray-500">{getLastMessagePreview(user)}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChatList;
