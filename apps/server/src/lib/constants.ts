const { DB_SCHEMA } = process.env;

export const TABLE_NAME = Object.freeze({
  CHART_FEATURE: `${DB_SCHEMA}.chart_features`,
  CHARTS: `${DB_SCHEMA}.charts`,
  USERS: `${DB_SCHEMA}.users`,
  BILLING: `${DB_SCHEMA}.billing`,
  EMBED: `${DB_SCHEMA}.embedded`,
});
