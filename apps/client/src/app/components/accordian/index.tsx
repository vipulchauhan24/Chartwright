import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface ICWAccordian {
  items: Array<{
    id: string;
    panelHeading: string;
    panelComponent: any;
  }>;
}

function CWAccordian() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-xl bg-white/5">
      <Disclosure
        as="div"
        className="border border-primary-border rounded-xl py-4 px-2"
        defaultOpen={true}
      >
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-lg font-medium text-white group-data-[hover]:text-white/80">
            Legend
          </span>
          <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
          If you're unhappy with your purchase, we'll refund you in full.
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

export default CWAccordian;
