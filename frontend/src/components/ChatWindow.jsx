import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import { socket, SOCKET_EVENTS } from "../socket/socket";

function ChatWindow({ selectedUser, currentUser, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedUserAvatar = useMemo(() => {
    if (!selectedUser?.username) return "??";
    return selectedUser.username.slice(0, 2).toUpperCase();
  }, [selectedUser?.username]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id || !currentUser?._id) return;

      setLoadingMessages(true);
      try {
        const { data } = await api.get(`/messages/${currentUser._id}/${selectedUser._id}`);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentUser?._id, selectedUser?._id]);

  // Socket listener for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (incomingMessage) => {
      if (!selectedUser?._id || !currentUser?._id) return;

      // Check if message belongs to current active chat
      const isForActiveChat =
        (incomingMessage.sender === currentUser._id &&
          incomingMessage.receiver === selectedUser._id) ||
        (incomingMessage.sender === selectedUser._id &&
          incomingMessage.receiver === currentUser._id);

      if (!isForActiveChat) return;

      // Prevent duplicates: only add if message ID doesn't exist
      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg._id === incomingMessage._id);
        return isDuplicate ? prev : [...prev, incomingMessage];
      });
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [currentUser?._id, selectedUser?._id]);

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || !selectedUser?._id || !currentUser?._id) return;

    try {
      const payload = {
        sender: currentUser._id,
        receiver: selectedUser._id,
        text,
      };

      const { data: newMessage } = await api.post("/messages", payload);
      setMessages((prev) => [...prev, newMessage]);
      
      // Call onMessageSent callback to update last message in ChatPage
      if (onMessageSent) {
        onMessageSent(newMessage);
      }
      
      // Emit socket event only if socket is connected
      if (socket.connected) {
        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, newMessage);
      }
      
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#efeae2]">
        <p className="text-lg text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9fdd3] text-sm font-semibold text-[#075e54]">
          {selectedUserAvatar}
        </div>
        <h2 className="text-base font-semibold text-gray-800">{selectedUser.username}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loadingMessages ? (
          <p className="text-sm text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">Start conversation</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isSent = message.sender === currentUser?._id;
              const time = new Date(message.timestamp).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div key={message._id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                      isSent ? "rounded-br-md bg-[#d9fdd3]" : "rounded-bl-md bg-white"
                    }`}
                  >
                    <p className="text-sm text-gray-800">{message.text}</p>
                    <p className="mt-1 text-right text-[11px] text-gray-500">{time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="rounded-lg bg-[#25d366] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#20bd5c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
