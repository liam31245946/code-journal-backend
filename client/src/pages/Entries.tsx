import { EntryList } from './EntryList';
import { EntryForm } from './EntryForm';

export function Entries() {
  return (
    <div className="container">
      <div className="flex">
        <div className="px-4">
          <EntryForm />
          <EntryList />
        </div>
      </div>
    </div>
  );
}
