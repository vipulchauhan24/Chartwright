import * as React from 'react';
import { Accordion } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import '../../assets/style.scss';

interface ICWAccordian {
  expandAll: boolean;
  areAllExpanded: (status: boolean) => void;
  items: Array<{
    title: string;
    panelComponent: React.ReactNode;
    panelHeadingButton?: React.ReactNode;
  }>;
}

export function CWAccordian(props: ICWAccordian) {
  const { expandAll, items, areAllExpanded } = props;

  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const flag = React.useRef(false);

  const allValues = React.useMemo(() => {
    return items.map((item) => item.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (flag.current) {
      flag.current = false;
      return;
    }
    if (expandAll) {
      setOpenItems(allValues);
    } else {
      setOpenItems([]);
    }
  }, [expandAll, allValues]);

  const updateOpenItems = React.useCallback(
    (items: string[]) => {
      setOpenItems(items);
      areAllExpanded(items.length === allValues.length);
      flag.current = true;

      setTimeout(() => {
        flag.current = false;
      }, 1000);
    },
    [allValues.length, areAllExpanded]
  );

  return (
    <Accordion.Root
      className="mx- auto w-full rounded-xl"
      type="multiple"
      value={openItems}
      onValueChange={updateOpenItems}
    >
      {items.map((item, indx) => {
        const { title, panelHeadingButton, panelComponent } = item;
        return (
          <Accordion.Item
            className="border border-default rounded-xl mt-2 bg-surface"
            value={title}
            key={`${title}-${indx}`}
          >
            <Accordion.Header>
              <Accordion.Trigger className="accordian-trigger flex w-full items-center justify-between p-4 cursor-pointer">
                <div className="flex items-center gap-1">
                  <span
                    title={title}
                    className="text-lg font-semibold truncate max-w-40"
                  >
                    {title}
                  </span>
                  {panelHeadingButton}
                </div>
                <ChevronDown
                  className="size-5 accordian-chevron"
                  aria-hidden={true}
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="mt-2 pb-4 px-4">
              {panelComponent}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
