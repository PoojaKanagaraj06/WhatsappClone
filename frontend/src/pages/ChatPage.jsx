import { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import api from "../services/api";
import { socket, SOCKET_EVENTS } from "../socket/socket";

function ChatPage({ currentUser, onLogout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [addingContact, setAddingContact] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: allUsers } = await api.get("/users");
        
        // Exclude current user from the list
        const otherUsers = allUsers.filter((user) => user._id !== currentUser._id);
        setUsers(otherUsers);

        // Fetch last message for each user
        const lastMsgs = {};
        for (const user of otherUsers) {
          try {
            const { data: messages } = await api.get(`/messages/${currentUser._id}/${user._id}`);
            if (messages.length > 0) {
              lastMsgs[user._id] = messages[messages.length - 1];
            }
          } catch (error) {
            console.error(`Failed to fetch messages for user ${user._id}:`, error);
          }
        }
        setLastMessages(lastMsgs);

        // Auto-select first user if available
        if (otherUsers.length > 0) {
          setSelectedUser(otherUsers[0]);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUser._id]);

  // Listen for incoming messages to update unread count and last message
  useEffect(() => {
    const handleReceiveMessage = (incomingMessage) => {
      // Update last message for the sender
      const senderId = incomingMessage.sender;
      setLastMessages((prev) => ({
        ...prev,
        [senderId]: incomingMessage,
      }));

      // Move sender to top of chat list
      setUsers((prev) => {
        const senderUser = prev.find((u) => u._id === senderId);
        if (!senderUser) return prev;
        const otherUsers = prev.filter((u) => u._id !== senderId);
        return [senderUser, ...otherUsers];
      });

      // Only update unread if message is not from selected user
      if (selectedUser && incomingMessage.sender === selectedUser._id) {
        return;
      }

      // Increment unread count for the sender
      setUnreadCounts((prev) => ({
        ...prev,
        [senderId]: (prev[senderId] || 0) + 1,
      }));
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [selectedUser]);

  // Clear unread count when user is selected
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Clear unread count for this user
    setUnreadCounts((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  const handleAddContact = async () => {
    const trimmedName = newContactName.trim();
    if (!trimmedName) return;

    setAddingContact(true);
    try {
      // Check if user already exists
      const { data: allUsers } = await api.get("/users");
      const existingUser = allUsers.find(
        (user) => user.username.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existingUser && existingUser._id === currentUser._id) {
        alert("Cannot add yourself!");
        return;
      }

      if (existingUser) {
        // User exists, add to contacts
        const alreadyAdded = users.some((u) => u._id === existingUser._id);
        if (!alreadyAdded) {
          setUsers([...users, existingUser]);
          handleSelectUser(existingUser);
        } else {
          alert("Contact already added");
        }
      } else {
        // Create new user
        const { data: newUser } = await api.post("/users", { 
          username: trimmedName 
        });
        setUsers([...users, newUser]);
        handleSelectUser(newUser);
      }

      setNewContactName("");
      setShowAddContact(false);
    } catch (error) {
      console.error("Failed to add contact:", error);
      alert("Failed to add contact");
    } finally {
      setAddingContact(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#efeae2] p-4">
      <div className="mx-auto flex h-full max-w-7xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Chat List - Left Panel */}
        <aside className="h-full w-[30%] border-r border-gray-200 bg-white flex flex-col">
          {/* User Info Bar */}
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">{currentUser.username}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <ChatList
            users={users}
            loading={loadingUsers}
            selectedUserId={selectedUser?._id || null}
            onSelectUser={handleSelectUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddContact={() => setShowAddContact(true)}
            unreadCounts={unreadCounts}
            lastMessages={lastMessages}
            currentUserId={currentUser._id}
          />
        </aside>

        {/* Chat Window - Right Panel */}
        <main className="h-full w-[70%] bg-[#f8fafc]">
          {currentUser ? (
            <ChatWindow 
              selectedUser={selectedUser} 
              currentUser={currentUser}
              onMessageSent={(message) => {
                // Update last message
                setLastMessages((prev) => ({
                  ...prev,
                  [selectedUser._id]: message,
                }));
                // Move selected user to top of chat list
                setUsers((prev) => {
                  const selectedUserObj = prev.find((u) => u._id === selectedUser._id);
                  if (!selectedUserObj) return prev;
                  const otherUsers = prev.filter((u) => u._id !== selectedUser._id);
                  return [selectedUserObj, ...otherUsers];
                });
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}
        </main>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Contact</h2>
            <input
              type="text"
              placeholder="Enter username"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#25d366] mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddContact(false);
                  setNewContactName("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddContact}
                disabled={addingContact || !newContactName.trim()}
                className="px-4 py-2 bg-[#25d366] text-white rounded-lg hover:bg-[#20bd5c] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingContact ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
