import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface ICWAccordian {
  id: string;
  panelHeading: string;
  panelComponent: React.ReactNode;
  defaultOpen?: boolean;
  panelHeadingButton?: React.ReactNode;
}

function CWAccordian(props: ICWAccordian) {
  const { id, panelHeading, defaultOpen, panelComponent, panelHeadingButton } =
    props;
  return (
    <div id={id} className="mx-auto w-full rounded-xl bg-white/5">
      <Disclosure
        as="div"
        className="border border-primary-border rounded-xl"
        defaultOpen={defaultOpen}
      >
        <DisclosureButton className="group flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-1">
            <span
              title={panelHeading}
              className="text-lg font-semibold text-white group-data-[hover]:text-white/80 truncate max-w-40"
            >
              {panelHeading}
            </span>
            {panelHeadingButton}
          </div>
          <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 pb-4 px-4">
          {panelComponent}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

export default CWAccordian;
