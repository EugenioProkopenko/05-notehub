import css from './SearchBox.module.css';
interface SearchBoxProps {
  search: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({ search, onSearch }: SearchBoxProps) {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    onSearch(value);
  };
  return (
    <input
      value={search}
      onChange={handleSearch}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
