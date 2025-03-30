const { DB_SCHEMA } = process.env;

export const TABLE_NAME = Object.freeze({
  NULL: 'null',
  CHART_FEATURE: `${DB_SCHEMA}.chart_features`,
  CHARTS: `${DB_SCHEMA}.charts`,
});
