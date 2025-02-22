export enum DATA_SET_KEY {
  label = 'label',
  data = 'data',
  borderColor = 'borderColor',
  borderWidth = 'borderWidth',
  borderRadius = 'borderRadius',
  backgroundColor = 'backgroundColor',
  hoverBackgroundColor = 'hoverBackgroundColor',
  hoverBorderColor = 'hoverBorderColor',
  hoverBorderWidth = 'hoverBorderWidth',
  barPercentage = 'barPercentage',
  hoverRadius = 'hoverRadius',
  hitRadius = 'hitRadius',
  order = 'order',
  rotation = 'rotation',
  radius = 'radius',
  pointRadius = 'pointRadius',
  pointStyle = 'pointStyle',
  pointBackgroundColor = 'pointBackgroundColor',
  pointHoverBackgroundColor = 'pointHoverBackgroundColor',
  pointBorderColor = 'pointBorderColor',
  pointHoverBorderColor = 'pointHoverBorderColor',
  pointBorderWidth = 'pointBorderWidth',
  fill = 'fill',
  display = 'display',
  position = 'position',
  alignment = 'alignment',
  color = 'color',
  fontSize = 'font-size',
  indexAxis = 'index-axis',
  gridXAxis = 'grid-x-axis',
  gridYAxis = 'grid-y-axis',
}

export enum INPUT_TYPE {
  CHECKBOX = 'checkbox',
  TEXT = 'text',
  SELECT = 'select',
  RANGE = 'range',
  TEXT_AREA = 'text-area',
  COLOR = 'color',
  NUMBER = 'number',
}

export type InputType =
  | INPUT_TYPE.COLOR
  | INPUT_TYPE.RANGE
  | INPUT_TYPE.SELECT
  | INPUT_TYPE.TEXT
  | INPUT_TYPE.TEXT_AREA
  | INPUT_TYPE.CHECKBOX
  | INPUT_TYPE.NUMBER;
