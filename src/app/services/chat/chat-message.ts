export class ChatMessage {
    sender: string;
    senderName?: string;
    receiver: string;
    font_face?: string;
    font_color?: string;
    bubble_color?: string;
    avatar?: string;
    message: string;
    datetime: string;
    type: string;
    previewImg?: string;
    status?: string;
    isGuest?: boolean;
}