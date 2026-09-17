

const emit = {
    "NewConversation"    : "New:Conversation",
    "ConversationList"   : "Get:ConversationList",
    "NewMessage"         : "New:SendMessage",
    "user_typing"        : "Typing:Start",
    "stopTyping"         : "Typing:Stop" ,
    "Online"             : "Ask:Online"  ,
    "MessageStatue"      : "Ask:MessageStatue",
    "SeenConve"          : "Seen:Conv"
} as const
const on   = {
    "CreateConversation" : "Conversation:Create"    ,
    "Conversation_list"  : "ConversationList:Search",
    "NewMassage"         : "Message:Create"         ,
    "user_typing"        : "Typing:Start",
    "TypingStop"         : "Typing:Stop" ,
    "Online"             : "Online:Check",
    "EnterChat"          : "Chat:Enter"  ,

} as const

export const SocketEvents = {
    emit,
    on,
} as const;