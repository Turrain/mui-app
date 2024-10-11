interface Reaction {
    [key: string]: string;
}

interface Company {
    name: string;
    com_limit: number;
    day_limit: number;
    sound_file_id: number;
    status: number;
    start_time: string;
    end_time: string;
    reaction: Reaction;
    phones_id: number;
    id: number;
    days: number[]
}

interface PhonesList {
    name: string;
    id: number;
    phones: Array<string>;
}

interface Soundfile {
    id: number;
    name: string;
    file_path: string;
}

interface UserCreate {
    // id: number;
    email: string;
    password: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
}

interface User {
    access_token: string;
    token_type: string;
    user_data?: UserCreate
}

interface UserLogin {
    username: string;
    password: string;
}

interface Audio {
    key: string;
    audio: string;
};

interface UserProps {
    name: string;
    username: string;
    avatar: string;
    online: boolean;
};

interface MessageProps {
    id: string;
    content: string;
    timestamp: string;
    unread?: boolean;
    sender: UserProps | 'You';
    attachment?: {
        fileName: string;
        type: string;
        size: string;
    };
};

interface ChatProps {
    id: string;
    sender: UserProps;
    messages: MessageProps[];
};

interface Task {
    id?: number;
    name: string;
    company: string;
    phone: string;
    comment?: string;
    task: string;
    datetime: Date | string;
}

interface Column {
    id: number;
    title: string;
    tasks: Task[];
    tagColor: string;
}

interface TaskChipCustomize {
    [key: string]: string;
}

interface CalendarEvents {
    id: number;
    title: string;
    start: Date;
    end: Date;
    // description?: string;
}

interface DayViewProps {
    events: CalendarEvents[];
    onDrop: (item: any, hour: number, date: Date) => void;
}