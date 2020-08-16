export class Update {
    title: string;
    date: string;
    items: string[];
}

export class BugReport {
    message: string;
}

export class Credentials {
    email: string;
    password: string;
}

export class Session {
    token: string;
}

export class AlertMessage {
    message: string;
    type: string; // accepts 'success' and 'error'
}
