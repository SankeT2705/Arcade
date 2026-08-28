import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomContext } from '../app/RoomContext';
import { useSocketContext } from '../app/SocketProvider';
import Avatar from './Avatar';
import { MessageSquareIcon, SendIcon, XIcon } from './Icons';
import { cn } from '../lib/utils';

const QUICK_EMOJIS = ['🔥', '😂', '👏', '🧠', '🎨', '💯', '✨', '👀'];

export default function RoomChat() {
  const { room, chatMessages, sendChatMessage } = useRoomContext();
  const { playerId } = useSocketContext();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const prevMsgLength = useRef(chatMessages?.length || 0);

  // Track unread messages when collapsed
  useEffect(() => {
    const currentLen = chatMessages?.length || 0;
    if (currentLen > prevMsgLength.current) {
      if (!isOpen) {
        const lastMsg = chatMessages[chatMessages.length - 1];
        if (lastMsg?.senderId !== playerId) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    }
    prevMsgLength.current = currentLen;
  }, [chatMessages, isOpen, playerId]);

  // Reset unread count when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleEmojiClick = (emoji) => {
    sendChatMessage(emoji);
  };

  if (!room) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="w-80 sm:w-96 h-[440px] bg-white rounded-2xl border border-surface-200 shadow-modal flex flex-col overflow-hidden mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between bg-surface-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <MessageSquareIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-heading font-bold text-surface-950 flex items-center gap-1.5">
                    Live Chat
                    <span className="font-mono text-[10px] text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                      {room.code}
                    </span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors"
                title="Close chat"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-surface-50/50">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-surface-400 text-xs px-4">
                  <MessageSquareIcon className="w-8 h-8 mb-2 text-surface-300" />
                  <p>Send a message! Chat is live in lobby and during games.</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.senderId === playerId;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2 text-xs',
                        isMe ? 'justify-end' : 'justify-start',
                      )}
                    >
                      {!isMe && (
                        <Avatar id={msg.senderId} name={msg.senderName} size="xs" />
                      )}
                      <div
                        className={cn(
                          'max-w-[78%] rounded-2xl px-3.5 py-2 leading-relaxed break-words shadow-xs',
                          isMe
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-white text-surface-900 border border-surface-200 rounded-bl-none',
                        )}
                      >
                        {!isMe && (
                          <p className="text-[10px] font-bold text-primary-700 mb-0.5">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-xs select-text">{msg.text}</p>
                        <p
                          className={cn(
                            'text-[9px] mt-0.5 text-right font-mono',
                            isMe ? 'text-primary-200' : 'text-surface-400',
                          )}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Emoji Bar */}
            <div className="px-3 py-1.5 border-t border-surface-200 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="hover:scale-120 active:scale-95 transition-transform p-1 text-sm shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSend}
              className="p-2.5 border-t border-surface-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message your friend…"
                maxLength={300}
                className="input-base !py-1.5 !px-3 text-xs"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn-primary !p-2 !rounded-xl text-xs font-semibold shrink-0"
                title="Send"
              >
                <SendIcon className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative bg-white hover:bg-surface-50 text-surface-800 p-3 rounded-2xl border border-surface-300 shadow-modal flex items-center justify-center transition-all group"
        title="Open chat"
      >
        <MessageSquareIcon className="w-5 h-5 text-primary-600" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
