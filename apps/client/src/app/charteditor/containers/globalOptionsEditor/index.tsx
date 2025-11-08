import { useAtom } from 'jotai';
import {
  activeChartConfig,
  activeChartFeatures,
} from '../../../../store/charts';
import { getNestedValue, setByPath } from '../../utils/lib';
import { useCallback, useMemo, useState } from 'react';
import {
  CWAccordian,
  CWGhostButton,
  CWPopover,
} from '@chartwright/ui-components';
import InputRenderer from '../inputRenderer';
import { LetterText, SquareDashedMousePointer } from 'lucide-react';

function GlobalOptionsEditor() {
  const [chartEditableFeatures] = useAtom(activeChartFeatures);
  const [chartDataConfig, setChartDataConfig] = useAtom(activeChartConfig);
  const [allOptionsOpen, setAllOptionsOpen] = useState<boolean>(false);

  const updateChartDataConfig = useCallback(
    (path: string, value: string | string[] | boolean | number | number[]) => {
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      setByPath(config, path, value);
      setChartDataConfig(config);
    },
    [chartDataConfig, setChartDataConfig]
  );

  const getInputValue = useCallback(
    (configPathPrefix: any, props: any) => {
      const value = getNestedValue(
        chartDataConfig,
        configPathPrefix
          ? configPathPrefix + props['configPath']
          : props['configPath']
      );
      if (typeof value === 'boolean') {
        return value;
      }
      return value || props['default'];
    },
    [chartDataConfig]
  );

  const getInputRenderedComp = useCallback(
    (option: any) => {
      return option.userInputs.map((props: any) => {
        return (
          <div className="mb-2">
            <InputRenderer
              key={props.configPath}
              id={props.configPath}
              {...props}
              value={getInputValue(null, props)}
              updateChartDataConfig={updateChartDataConfig}
              configPathPrefix={''}
            />
          </div>
        );
      });
    },
    [getInputValue, updateChartDataConfig]
  );

  const getPopoverIcon = useCallback((iconName: string) => {
    switch (iconName) {
      case 'text':
        return <LetterText className="size-4" aria-hidden={true} />;
      case 'tooltip':
        return (
          <SquareDashedMousePointer className="size-4" aria-hidden={true} />
        );

      default:
        return null;
    }
  }, []);

  const getChildrens = useCallback(
    (option: any) => {
      return option.children
        ? option.children.map((childComp: any, indx: number) => {
            switch (childComp.type) {
              case 'popover':
                return (
                  <div className="mr-2" key={`${childComp.title}-${indx}`}>
                    <CWPopover
                      content={getInputRenderedComp(childComp)}
                      title={childComp.title}
                      icon={getPopoverIcon(childComp.iconName)}
                    />
                  </div>
                );
              default:
                return null;
            }
          })
        : [];
    },
    [getInputRenderedComp, getPopoverIcon]
  );

  const globalOptions = useMemo(() => {
    if (!chartDataConfig || !chartEditableFeatures?.globalOptions) {
      return [];
    }

    return chartEditableFeatures.globalOptions.map((option) => {
      return {
        title: option.title,
        panelComponent: [
          ...getInputRenderedComp(option),
          ...getChildrens(option),
        ],
      };
    });
  }, [
    chartDataConfig,
    chartEditableFeatures,
    getChildrens,
    getInputRenderedComp,
  ]);

  if (!chartDataConfig || !chartEditableFeatures?.globalOptions) {
    return null;
  }

  return (
    <div className="p-4 flex flex-col items-end">
      <CWGhostButton
        label={allOptionsOpen ? 'Collapse All' : 'Expand All'}
        onClick={() => {
          setAllOptionsOpen((prev) => !prev);
        }}
      />
      <div className="w-full mt-2">
        <CWAccordian
          items={globalOptions}
          expandAll={allOptionsOpen}
          areAllExpanded={setAllOptionsOpen}
        />
      </div>
    </div>
  );
}

export default GlobalOptionsEditor;
