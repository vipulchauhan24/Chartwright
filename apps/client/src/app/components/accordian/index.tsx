import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

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
    <div id={id} className="mx-auto w-full rounded-xl">
      <Disclosure
        as="div"
        className="border border-primary-border rounded-xl"
        defaultOpen={defaultOpen}
      >
        <DisclosureButton className="group flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-1">
            <span
              title={panelHeading}
              className="text-lg font-semibold truncate max-w-40"
            >
              {panelHeading}
            </span>
            {panelHeadingButton}
          </div>
          <ChevronDown
            className="size-5 group-data-[open]:rotate-180"
            aria-hidden={true}
          />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 pb-4 px-4">
          {panelComponent}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

export default CWAccordian;
