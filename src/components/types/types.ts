interface Reaction {
    [key: string]: string;
};

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
    id: string;
};

interface PhonesList {
    name: string;
    id: number;
    phones: Array<string>;
}

interface Soundfile {
    name: string;
    id: number;
    file_path: string;
}

interface UserCreate {
    id: number;
    email: string;
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
