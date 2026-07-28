import { useMutation, useQuery } from '@tanstack/react-query';
import css from './App.module.css';
import {
  createNote,
  deleteNote,
  fetchNotes,
  type NewNoteData,
} from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import { useState } from 'react';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';
import { useQueryClient } from '@tanstack/react-query';

export default function App() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data } = useQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(search, page),
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      handleCloseModal();

      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });
  const { mutate: createMutation } = useMutation({
    mutationFn: createNote,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    deleteMutation(id);
  };
  const handleCreate = (newNoteData: NewNoteData) => {
    console.log(newNoteData);
    createMutation(newNoteData);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <button className={css.button} onClick={handleOpenModal}>
            Create note +
          </button>
          {data && <SearchBox search={search} onSearch={handleSearch} />}
          {/* Пагінація */}
          {/* Кнопка створення нотатки */}
        </header>
        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onSubmit={handleCreate} onClose={handleCloseModal} />
          </Modal>
        )}
        {data && <NoteList notes={data.notes} onDelete={handleDelete} />}
      </div>
    </>
  );
}
