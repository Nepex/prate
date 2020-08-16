export class FriendMessageData {
    id: string;
    name: string;
    avatar: string;
    status: string;
    isTyping?: boolean;
    isFocused?: boolean;
    isOpen?: boolean;
    messages?: any[];
    unreadMessages?: boolean;
};

export class FriendRequest {
    senderId?: string;
    receiverId?: string;
    senderName?: string;
    receiverName?: string;
    senderEmail?: string;
    receiverEmail?: string;
}