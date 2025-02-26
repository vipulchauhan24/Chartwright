import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ICWDropdown {
  items: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

function CWDropdown(props: ICWDropdown) {
  const { items } = props;
  const [selected, setSelected] = useState(items[0]);

  const onItemSelected = (selectedItemValue: any) => {
    const selectedItem = items.find((item) => item.value === selectedItemValue);
    if (selectedItem) {
      setSelected(selectedItem);
    }
  };

  return (
    <Listbox value={selected} onChange={onItemSelected}>
      <ListboxButton className="text-primary-text py-2 pl-3 pr-8 border border-primary-border rounded-lg relative w-32 truncate">
        {selected.label}
        <ChevronDownIcon
          className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-primary-text"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="border border-primary-border rounded-lg"
      >
        {items.map((item) => (
          <ListboxOption
            key={item.id}
            value={item.value}
            className="group flex items-center gap-2 py-2 px-1 w-32 select-none cursor-pointer hover:bg-primary-background"
          >
            <div className="text-sm/6 text-primary-text">{item.label}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

export default CWDropdown;
