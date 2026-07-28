import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const API_URL = 'https://notehub-public.goit.study/api/notes';

export interface FetchNotes {
  notes: Note[];
  totalPages: number;
}

export interface CreateNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotes> => {
  const params: Record<string, string | number> = { page };
  if (search) {
    params.search = search;
  }

  const response = await axios.get<FetchNotes>(API_URL, {
    params,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return response.data;
};

export const createNote = async (createNote: CreateNote): Promise<Note> => {
  const response = await axios.post<Note>(API_URL, createNote, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
};
