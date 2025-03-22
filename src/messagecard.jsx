import React from "react";

const Message_card = ({ props, onClick }) => {
  return (
    <div onClick={() => onClick(props)} className="cursor-pointer p-4 hover:bg-gray-100">
      <div className="flex items-center">
        {/* Profile Image */}
        <img
          src={`http://localhost:3000${props.profile_image}`}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* User Info */}
        <div className="flex flex-col ml-4 flex-1">
          <h3 className="font-medium text-gray-800">{props.username}</h3>
          <p className="text-gray-600 text-sm truncate max-w-xs">
            {props.lastMessage ? props.lastMessage : "No messages yet..."}
          </p>
        </div>

        {/* Timestamp */}
        {props.lastMessageTime && (
          <p className="text-xs text-gray-400 ml-auto">
            {new Date(props.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default Message_card;