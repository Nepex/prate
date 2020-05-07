import { LevelInfo } from '../level/level-info';

export class User {
    id?: string;
    name: string;
    email?: string;
    password?: string;
    interests?: string[];
    clientId?: string;
    font_face?: string;
    font_color?: string;
    bubble_color?: string;
    avatar?: string;
    show_avatars?: boolean;
    bubble_layout?: string;
    webSocketAuth?: string;
    token?: string;
    experience?: number;
    levelInfo?: LevelInfo;
}