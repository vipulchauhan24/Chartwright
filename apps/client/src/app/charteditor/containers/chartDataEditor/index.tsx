import { useAtom } from 'jotai';
import {
  currentChartConfigStore,
  currentChartGlobalConfig,
} from '../../../../store/charts';
import { getNestedValue, setByPath } from '../../utils/lib';
import { useCallback, useMemo, useState } from 'react';
import {
  CWAccordian,
  CWGhostButton,
  CWPopover,
} from '@chartwright/core-components';
import InputRenderer from '../inputRenderer';
import { LetterText, SquareDashedMousePointer } from 'lucide-react';

import GridIcon from '../../../../assets/grid.svg?react';
import XAxisEdgeIcon from '../../../../assets/x-axis-edge.svg?react';
import YAxisEdgeIcon from '../../../../assets/y-axis-edge.svg?react';

function ChartDataEditor() {
  const [chartEditableFeatures] = useAtom(currentChartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(
    currentChartConfigStore
  );
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
    (option: any, indx: number) => {
      return option.userInputs.map((props: any) => {
        return (
          <div className="mb-2">
            <InputRenderer
              key={props.configPath}
              id={props.configPath}
              {...props}
              value={getInputValue(indx > -1 ? `series.${indx}.` : null, props)}
              updateChartDataConfig={updateChartDataConfig}
              configPathPrefix={indx > -1 ? `series.${indx}.` : ''}
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
      case 'x-axis-edge':
        return <XAxisEdgeIcon className="size-4" aria-hidden={true} />;
      case 'y-axis-edge':
        return <YAxisEdgeIcon className="size-4" aria-hidden={true} />;
      case 'grid':
        return <GridIcon className="size-4" aria-hidden={true} />;
      default:
        return null;
    }
  }, []);

  const getChildrens = useCallback(
    (option: any, indx: number) => {
      return option.children
        ? option.children.map((childComp: any) => {
            switch (childComp.type) {
              case 'popover':
                return (
                  <span className="mr-2">
                    <CWPopover
                      content={getInputRenderedComp(childComp, indx)}
                      title={childComp.title}
                      icon={getPopoverIcon(childComp.iconName)}
                      side="left"
                    />
                  </span>
                );
              default:
                return null;
            }
          })
        : [];
    },
    [getInputRenderedComp, getPopoverIcon]
  );

  const chartEditOptions = useMemo(() => {
    if (
      !chartDataConfig ||
      !chartEditableFeatures?.chartEditOptions ||
      !chartEditableFeatures?.chartEditSeries
    ) {
      return [];
    }

    const options = [
      ...chartEditableFeatures.chartEditOptions.map((option) => {
        return {
          title: option.title,
          panelComponent: [
            ...getInputRenderedComp(option, -1),
            ...getChildrens(option, -1),
          ],
        };
      }),
    ];

    chartDataConfig.series.forEach((item: { name: string }, indx: number) => {
      options.push(
        ...chartEditableFeatures.chartEditSeries.map((option) => {
          return {
            title: item.name || `${option.title} ${indx + 1}`,
            panelComponent: [
              ...getInputRenderedComp(option, indx),
              ...getChildrens(option, indx),
            ],
          };
        })
      );
    });

    return options;
  }, [
    chartDataConfig,
    chartEditableFeatures,
    getChildrens,
    getInputRenderedComp,
  ]);

  if (
    !chartDataConfig?.series ||
    !chartEditableFeatures?.chartEditOptions ||
    !chartEditableFeatures?.chartEditSeries
  ) {
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
          items={chartEditOptions}
          expandAll={allOptionsOpen}
          areAllExpanded={setAllOptionsOpen}
        />
      </div>
    </div>
  );
}

export default ChartDataEditor;
