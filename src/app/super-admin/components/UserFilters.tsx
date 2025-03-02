interface UserFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  onAddUser: () => void;
  refreshUsers: () => Promise<void>;
}

export default function UserFilters({ search, setSearch, filter, setFilter }: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-3 sm:space-y-0">
      <div className="max-w-lg w-full">
        <label htmlFor="search" className="sr-only">
          Search users
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-itg-red focus:border-itg-red sm:text-sm"
            placeholder="Search by email"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
          Filter:
        </label>
        <select
          id="filter"
          name="filter"
          className="mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-itg-red focus:border-itg-red sm:text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="user">Regular Users</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>
    </div>
  );
}