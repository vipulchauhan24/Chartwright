const { DB_SCHEMA } = process.env;

export const TABLE_NAME = Object.freeze({
  CHART_FEATURE: `${DB_SCHEMA}.chart_features`,
  CHART_DEFAULT_CONFIG: `${DB_SCHEMA}.chart_default_config`,
  CHART_TEMPLATES: `${DB_SCHEMA}.chart_templates`,
  CHARTS: `${DB_SCHEMA}.charts`,
  USERS: `${DB_SCHEMA}.users`,
  BILLING: `${DB_SCHEMA}.billing`,
  EMBED: `${DB_SCHEMA}.embedded`,
});
