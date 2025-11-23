const { DB_SCHEMA, DB_SCHEMA_DEV, NODE_ENV } = process.env;

const schema = NODE_ENV === 'development' ? DB_SCHEMA_DEV : DB_SCHEMA;

export const TABLE_NAME = Object.freeze({
  CHART_FEATURE: `${schema}.chart_features`,
  CHART_BASE_CONFIG: `${schema}.chart_base_config`,
  CHART_TEMPLATES: `${schema}.chart_templates`,
  USER_CHARTS: `${schema}.user_charts`,
  USERS: `${schema}.users`,
  BILLING: `${schema}.billing`,
  EMBEDDED_CHARTS: `${schema}.embedded_charts`,
});

export enum SERVER_ERROR_MESSAGES {
  INTERNAL_SERVER_ERROR = 'Internal server error.',
}

export const POSTGRES_ERROR_CODES = Object.freeze({
  DUPLICATE_KEY: '23505',
  INVALID_VALUE: '22P02',
});
