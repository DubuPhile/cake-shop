import { SearchIcon } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`my-3 ${className}`}>
      <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
        <SearchIcon className="w-5 h-5 text-gray-500 ml-3" />

        <input
          id="Searchbar"
          type="text"
          className="w-full py-2 px-4 rounded-lg outline-none text-gray-700"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
