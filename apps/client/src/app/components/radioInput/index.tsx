import { Radio, RadioGroup } from '@headlessui/react';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

interface ICWRadioInput {
  items: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  onChange: (vaue: string) => void;
}

function CWRadioInput(props: ICWRadioInput) {
  const { items, onChange } = props;
  const [selected, setSelected] = useState(items[0]);

  const onItemSelected = (selectedItemValue: {
    id: string;
    label: string;
    value: string;
  }) => {
    const selectedItem = items.find((item) => item.id === selectedItemValue.id);
    if (selectedItem) {
      setSelected(selectedItem);
      onChange(selectedItemValue.value);
    }
  };

  return (
    <RadioGroup
      value={selected}
      onChange={onItemSelected}
      className="flex items-center gap-2"
    >
      {items.map((item) => (
        <Radio
          id={item.id}
          key={item.id}
          value={item}
          className="group relative flex cursor-pointer rounded-lg p-2 border border-border data-[checked]:border-primary"
        >
          <div className="flex w-full items-center gap-2">
            <p className="font-semibold text-sm text-text-main select-none">
              {item.label}
            </p>
            <CircleCheck className="size-6 stroke-border group-data-[checked]:stroke-primary" />
          </div>
        </Radio>
      ))}
    </RadioGroup>
  );
}

export default CWRadioInput;
