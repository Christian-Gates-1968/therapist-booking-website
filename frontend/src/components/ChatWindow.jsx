import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { ChatbotContext } from "../context/ChatbotContext";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Phone, User } from "lucide-react";
import io from "socket.io-client";

const SPECIALTIES = [
  "Clinical Psychologist",
  "Psychiatrist",
  "Relationship and Marriage Counsellor",
  "Child and Adolescent Counsellor",
  "Trauma and Abuse Counsellor",
  "Anxiety and Depression Specialist",
  "Career Counsellor",
];

const ChatWindow = () => {
  const { messages, addMessage } = useContext(ChatbotContext);
  const { backendUrl, token, userData } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [searchingDoctor, setSearchingDoctor] = useState(false);
  const [socket, setSocket] = useState(null);
  const chatRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  // Initialize socket connection
  useEffect(() => {
    if (token && userData) {
      console.log('User connecting to socket:', userData.name, userData._id)
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        // Socket connected
      })

      // Listen for consultation acceptance
      newSocket.on("consultation-accepted", ({ meetingId, doctorName }) => {

        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
          searchTimeoutRef.current = null
        }
        setSearchingDoctor(false);
        addMessage({
          text: `Great! ${doctorName || 'A doctor'} is available. Joining video call...`,
          sender: "bot",
        });
        setTimeout(() => {
          navigate(`/video-call/${meetingId}`);
        }, 1500);
      });

      // Listen for consultation declined
      newSocket.on("consultation-declined", () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
          searchTimeoutRef.current = null
        }
        setSearchingDoctor(false);
        addMessage({
          text: "Unfortunately, the doctor is busy. They will schedule a time with you shortly.",
          sender: "bot",
        });
      });

      // Listen for consultation scheduled
      newSocket.on("consultation-scheduled", ({ scheduledDate, scheduledTime, doctorName, message }) => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
          searchTimeoutRef.current = null
        }
        setSearchingDoctor(false);
        addMessage({
          text: message || `Your consultation has been scheduled for ${scheduledDate} at ${scheduledTime}.`,
          sender: "bot",
        });
        addMessage({
          text: "You can view this appointment in 'My Appointments' page.",
          sender: "bot",
        });
      });

      // Listen for no doctors available
      newSocket.on("consultation-unavailable", ({ message }) => {
        console.log('No doctors available')
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
          searchTimeoutRef.current = null
        }
        setSearchingDoctor(false);
        addMessage({
          text: message || "No doctors are currently available. Please try booking an appointment.",
          sender: "bot",
        });
      });

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }
        newSocket.disconnect();
      };
    } else {
      console.log('ChatWindow waiting for token/userData:', { token: !!token, userData: !!userData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userData, backendUrl]);

  const handleTalkToHuman = async () => {
    console.log('Talk to Human clicked!')
    
    if (!token) {
      addMessage({
        text: "Please login to talk to a doctor.",
        sender: "bot",
      });
      navigate("/login");
      return;
    }

    if (!socket) {
      console.error('Socket not connected!')
      addMessage({
        text: "Connection error. Please refresh the page.",
        sender: "bot",
      });
      return;
    }

    if (!userData) {
      console.error('User data not loaded!')
      addMessage({
        text: "Loading your profile... Please try again in a moment.",
        sender: "bot",
      });
      return;
    }

    setSearchingDoctor(true);
    addMessage({
      text: "Searching for available doctors... Please wait.",
      sender: "bot",
    });

    console.log('Emitting request-consultation:', {
      userId: userData._id,
      userName: userData.name,
      userEmail: userData.email,
    })

    // Emit socket event to request consultation
    socket.emit("request-consultation", {
      userId: userData._id,
      userName: userData.name,
      userEmail: userData.email,
    });

    // Set timeout in case no doctor responds
    searchTimeoutRef.current = setTimeout(() => {
      console.log('Request timed out - no response')
      setSearchingDoctor(false);
      addMessage({
        text: "No doctors are currently available. Please try booking an appointment instead.",
        sender: "bot",
      });
    }, 30000); // 30 seconds timeout
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      addMessage({ text: trimmedInput, sender: "user" });
      setInput("");
      setIsBotTyping(true);

      try {
        const history = messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

        const response = await axios.post(`${backendUrl}/api/chatbot/chatbot`, {
          message: trimmedInput,
          history,
        });

        addMessage({ text: response.data.reply, sender: "bot" });
      } catch (error) {
        addMessage({
          text: "Error: Could not connect to the chatbot.",
          sender: "bot",
        });
      } finally {
        setIsBotTyping(false);
      }
    }
  };

  // Renders messages and attaches onClick to specialties
  const renderMessage = useCallback(
    (msg) => {
      // Split text by specialties so we can inject clickable spans
      let parts = [msg.text];
      SPECIALTIES.forEach((specialty) => {
        parts = parts.flatMap((part) =>
          typeof part === "string"
            ? part.split(specialty).reduce((acc, curr, i, arr) => {
                if (i < arr.length - 1) {
                  // Before, clickable, after
                  return [
                    ...acc,
                    curr,
                    { type: "specialty", label: specialty },
                  ];
                }
                return [...acc, curr];
              }, [])
            : [part]
        );
      });

      return (
        <span className="leading-relaxed text-sm">
            
          {parts.map((part, i) => {
            if (typeof part === "string") {
              // Format line breaks and styling as before
              let formatted = part
                .replace(/\n\n/g, "\x01") // temp marker for double line break
                .replace(/\n/g, "<br/>")
                .replace(/\x01/g, "<br/><br/>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/- (.*?)(<br\/>|$)/g, "• $1<br/>")
                .replace(/### (.+?)\n/g, "<h3>$1</h3>");
              return (
                <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
              );
            }
            if (part.type === "specialty") {
              return (
                <span
                  key={i}
                  onClick={() =>
                    navigate(`/doctors/${encodeURIComponent(part.label)}`)
                  }
                  className="text-blue-600 underline hover:text-blue-800 font-medium cursor-pointer"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/doctors/${encodeURIComponent(part.label)}`);
                    }
                  }}
                >
                  {part.label}
                </span>
              );
            }
            return null;
          })}
        </span>
      );
    },
    [navigate]
  );

  return (
    <div className="fixed bottom-20 right-5 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-fuchsia-600 text-white p-3 rounded-t-xl flex items-center justify-between">
        <h3 className="font-semibold text-lg">Chat with us!</h3>
        <button
          onClick={handleTalkToHuman}
          disabled={searchingDoctor}
          className={`flex items-center gap-1 bg-white text-fuchsia-600 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-100 transition-all ${
            searchingDoctor ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Talk to a human doctor"
        >
          {searchingDoctor ? (
            <>
              <div className="w-3 h-3 border-2 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Phone className="w-3 h-3" />
              <span>Talk to Human</span>
            </>
          )}
        </button>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3"
        ref={chatRef}
      >
        <div>Hi there! How can I help you today? Type a message to begin!</div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-fuchsia-600 text-white self-end rounded-br-none"
                : "bg-gray-100 text-gray-800 self-start rounded-bl-none border border-gray-200"
            }`}
            style={{ wordWrap: "break-word" }}
          >
            {renderMessage(msg)}
          </div>
        ))}
        {isBotTyping && (
          <div className="p-3 rounded-lg bg-gray-100 self-start text-sm text-gray-800 italic max-w-xs border border-gray-200 animate-pulse">
            Bot is typing...
          </div>
        )}
      </div>
      {/* Input Area */}
      <div className="p-3 border-t flex items-center bg-white rounded-b-xl">
        <input
          type="text"
          className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-3 py-2 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md text-xs font-semibold"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
