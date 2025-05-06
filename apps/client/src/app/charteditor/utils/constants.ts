export const simpleChartTypes: Array<{
  id: string;
  label: string;
  value: string;
}> = [
  {
    id: 'bar-chart-dd',
    label: 'Bar Chart',
    value: 'simple-bar-chart',
  },
  {
    id: 'column-chart-dd',
    label: 'Column Chart',
    value: 'simple-column-chart',
  },
  {
    id: 'line-chart-dd',
    label: 'Line Chart',
    value: 'simple-line-chart',
  },
  {
    id: 'area-chart-dd',
    label: 'Area Chart',
    value: 'simple-area-chart',
  },
  {
    id: 'bubble-chart-dd',
    label: 'Bubble Chart',
    value: 'simple-bubble-chart',
  },
  {
    id: 'pie-chart-dd',
    label: 'Pie Chart',
    value: 'simple-pie-chart',
  },
];

export const legendPositions: Array<{
  id: string;
  label: string;
  value: string;
}> = [
  {
    id: 'legend-top',
    label: 'Top',
    value: 'top',
  },
  {
    id: 'legend-right',
    label: 'Right',
    value: 'right',
  },
  {
    id: 'legend-bottom',
    label: 'Bottom',
    value: 'bottom',
  },
  {
    id: 'legend-left',
    label: 'Left',
    value: 'left',
  },
];

export const alignments: Array<{ id: string; label: string; value: string }> = [
  {
    id: 'alignments-left',
    label: 'Left',
    value: 'left',
  },
  {
    id: 'alignments-center',
    label: 'Center',
    value: 'center',
  },
  {
    id: 'alignments-right',
    label: 'Right',
    value: 'right',
  },
];

export const fontWeights: Array<{ id: string; label: string; value: string }> =
  [
    {
      id: 'weight-normal',
      label: 'Normal',
      value: '500',
    },
    {
      id: 'weight-bold',
      label: 'Bold',
      value: '700',
    },
    {
      id: 'weight-extra-bold',
      label: 'Extra bold',
      value: '900',
    },
  ];

export const fontFamilies: Array<{ id: string; label: string; value: string }> =
  [
    {
      id: 'font-family-helvetica',
      label: 'Helvetica',
      value: 'Helvetica',
    },
    {
      id: 'font-family-poppins',
      label: 'Poppins',
      value: 'Poppins',
    },
    {
      id: 'font-family-garamond',
      label: 'Garamond',
      value: 'Garamond',
    },
    {
      id: 'font-family-merriweather',
      label: 'Merriweather',
      value: 'Merriweather',
    },
    {
      id: 'font-family-courier-new',
      label: 'Courier New',
      value: 'Courier New',
    },
    {
      id: 'font-family-consolas',
      label: 'Consolas',
      value: 'Consolas',
    },
    {
      id: 'font-family-menlo',
      label: 'Menlo',
      value: 'Menlo',
    },
    {
      id: 'font-family-plus-jakarta-sans',
      label: 'Plus Jakarta Sans',
      value: 'Plus Jakarta Sans',
    },
  ];

export const textAnchors: Array<{ id: string; label: string; value: string }> =
  [
    {
      id: 'text-anchor-start',
      label: 'Start',
      value: 'start',
    },
    {
      id: 'text-anchor-middle',
      label: 'Middle',
      value: 'middle',
    },
    {
      id: 'text-anchor-end',
      label: 'End',
      value: 'end',
    },
  ];

export const dataLabelsPositions: Array<{
  id: string;
  label: string;
  value: string;
}> = [
  {
    id: 'data-label-top',
    label: 'Top',
    value: 'top',
  },
  {
    id: 'data-label-center',
    label: 'Center',
    value: 'center',
  },
  {
    id: 'data-label-bottom',
    label: 'Bottom',
    value: 'bottom',
  },
];

export const dataLabelsOrientations: Array<{
  id: string;
  label: string;
  value: string;
}> = [
  {
    id: 'data-label-vertical',
    label: 'Vertical',
    value: 'vertical',
  },
  {
    id: 'data-label-horizontal',
    label: 'Horizontal',
    value: 'horizontal',
  },
];

export const borderRadiusApplications: Array<{
  id: string;
  label: string;
  value: string;
}> = [
  {
    id: 'border-radius-application-around',
    label: 'Around',
    value: 'around',
  },
  {
    id: 'border-radius-application-end',
    label: 'End',
    value: 'end',
  },
];

export const exportImageTypes: Array<{
  id: string;
  label: string;
  value: string;
}> = [
  {
    id: 'export-png',
    label: 'Png',
    value: 'png',
  },
  {
    id: 'export-svg',
    label: 'Svg',
    value: 'svg',
  },
  {
    id: 'export-jpeg',
    label: 'Jpeg',
    value: 'jpeg',
  },
  {
    id: 'export-webp',
    label: 'Webp',
    value: 'webp',
  },
];

export enum LOCAL_STORAGE_KEYS {
  USER_ID = 'user_id',
}

export enum SESSION_STORAGE_KEYS {
  IS_GHOST_USER = 'isGuestUser',
  GAL_CHART_ID = 'gal-chart-id',
}
