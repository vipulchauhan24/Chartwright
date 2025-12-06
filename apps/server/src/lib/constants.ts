const { DB_SCHEMA, DB_SCHEMA_DEV, NODE_ENV } = process.env;

const schema = NODE_ENV === 'development' ? DB_SCHEMA_DEV : DB_SCHEMA;

export const TABLE_ENUMS = Object.freeze({
  BILLING_INTERVAL: `${schema}.billing_interval`,
  CHART_TYPES: `${schema}.chart_types`,
  CURRENCIES: `${schema}.currencies`,
  EMBED_CHART_TYPES: `${schema}.embedded_chart_type`,
  USER_PLAN: `${schema}.user_plans`,
  USER_PRIVILEGES: `${schema}.user_privileges`,
  USER_STATUS: `${schema}.user_status`,
});

export const TABLE_NAME = Object.freeze({
  CHART_FEATURE: `${schema}.chart_features`,
  CHART_BASE_CONFIG: `${schema}.chart_base_config`,
  CHART_TEMPLATES: `${schema}.chart_templates`,
  USER_CHARTS: `${schema}.user_charts`,
  USERS: `${schema}.users`,
  BILLING: `${schema}.billing`,
  EMBEDDED_CHARTS: `${schema}.embedded_charts`,
  SUBSCRIPTION_PLANS: `${schema}.subscription_plans`,
  USER_SUBSCRIPTIONS: `${schema}.user_subscriptions`,
});

export enum SERVER_ERROR_MESSAGES {
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  FORRBIDDEN_ERROR = 'Access to the resource if either revoked or expired.',
}

export const POSTGRES_ERROR_CODES = Object.freeze({
  DUPLICATE_KEY: '23505',
  INVALID_VALUE: '22P02',
});
