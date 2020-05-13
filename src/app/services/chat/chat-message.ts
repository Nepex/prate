export class ChatMessage {
    sender: string;
    receiver: string;
    message?: string;
    datetime: string;
    type: string;
    outerAppType?: string;
    outerAppLink?: string;
}