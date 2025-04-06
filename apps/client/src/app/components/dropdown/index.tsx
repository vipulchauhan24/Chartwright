import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ICWDropdown {
  items: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  onChange: (vaue: string) => void;
  selectedIndex: number;
}

function CWDropdown(props: ICWDropdown) {
  const { items, onChange, selectedIndex } = props;
  const [selected, setSelected] = useState(items[selectedIndex]);

  const onItemSelected = (selectedItemValue: any) => {
    const selectedItem = items.find((item) => item.value === selectedItemValue);
    if (selectedItem) {
      setSelected(selectedItem);
      onChange(selectedItemValue);
    }
  };

  useEffect(() => {
    setSelected(items[selectedIndex]);
  }, [items, selectedIndex]);

  return (
    <Listbox value={selected} onChange={onItemSelected}>
      <ListboxButton className="text-primary-text text-md py-2 pl-3 pr-8 border border-primary-border rounded-lg relative w-32 truncate">
        {selected.label}
        <ChevronDown
          className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-primary-text"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="border border-primary-border rounded-lg bg-secondary-background"
      >
        {items.map((item) => (
          <ListboxOption
            key={item.id}
            value={item.value}
            className="p-2 w-32 select-none cursor-pointer hover:bg-primary-main text-md text-primary-text hover:text-primary-background"
          >
            {item.label}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

export default CWDropdown;
