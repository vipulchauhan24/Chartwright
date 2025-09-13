import React from 'react';
import { Tabs } from 'radix-ui';
import clsx from 'clsx';

interface ICWTabs {
  defaultSelected: string;
  tabList: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }>;
}

export function CWTabs(props: ICWTabs) {
  const { defaultSelected, tabList } = props;
  return (
    <Tabs.Root defaultValue={defaultSelected}>
      <Tabs.List className="flex">
        {tabList.map(({ id, title, icon }, indx) => (
          <Tabs.Trigger
            className={clsx(
              indx === 0 && 'rounded-l-md',
              indx === tabList.length - 1 && 'rounded-r-md',
              'h-[45px] flex gap-1 flex-1 cursor-pointer items-center justify-center bg-primary-200 data-[state=active]:text-surface data-[state=active]:font-bold data-[state=active]:bg-primary-600'
            )}
            value={id}
            key={id}
            aria-label={title}
          >
            {icon}
            {title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabList.map(({ id, content }) => (
        <Tabs.Content className="pt-4" value={id} key={id}>
          {content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
