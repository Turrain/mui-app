interface Reaction  {
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
  