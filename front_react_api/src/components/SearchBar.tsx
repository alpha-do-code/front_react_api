type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      className="w-full border p-2 rounded mb-4 placeholder:text-gray-500 placeholder:italic"
      placeholder="Rechercher une tâche..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
