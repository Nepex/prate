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