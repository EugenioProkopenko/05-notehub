import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query';
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
import Pagination from '../Pagination/Pagination';
import { useDebounce } from 'use-debounce';

export default function App() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data } = useQuery({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });
  const { mutate: createMutation } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      handleCloseModal();

      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    deleteMutation(id);
  };
  const handleCreate = (newNoteData: NewNoteData) => {
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
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              onPageChange={setPage}
              totalPages={data.totalPages}
            />
          )}
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
