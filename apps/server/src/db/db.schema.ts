import {
  pgSchema,
  uniqueIndex,
  uuid,
  json,
  text,
  integer,
  date,
  jsonb,
  numeric,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { relations } from 'drizzle-orm/relations';

enum EMBEDDABLES {
  STATIC_IMAGE = 'static-image',
  DYNAMIC_IFRAME = 'dynamic-iframe',
}

export const chartwrightDev = pgSchema('chartwright_dev');

export const chartTypesEnum = chartwrightDev.enum('chart_types', [
  'bar',
  'line',
  'area',
  'column',
]);
export const userPrivilegesEnum = chartwrightDev.enum('user_privileges', [
  'exports_embed_image_5',
  'exports_embed_image_unlimited',
  'exports_embed_iframe_5',
  'exports_embed_iframe_unlimited',
  'save_as_pdf_unlimited',
  'save_as_image_unlimited',
  'save_charts_10',
  'save_charts_unlimited',
]);
export const embeddedChartTypeEnum = chartwrightDev.enum(
  'embedded_chart_type',
  [EMBEDDABLES.STATIC_IMAGE, EMBEDDABLES.DYNAMIC_IFRAME]
);
export const userPlansEnum = chartwrightDev.enum('user_plans', [
  'FREE',
  'PRO',
  'ENTERPRISE',
]);
export const currenciesEnum = chartwrightDev.enum('currencies', ['USD', 'INR']);
export const billingIntervalEnum = chartwrightDev.enum('billing_interval', [
  'MONTHLY',
  'WEEKLY',
  'YEARLY',
]);
export const userStatusEnum = chartwrightDev.enum('user_status', [
  'ACTIVE',
  'TRIALING',
  'PAUSED',
  'CANCELLED',
  'EXPIRED',
  'BANNED',
]);

export const chartBaseConfig = chartwrightDev.table(
  'chart_base_config',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    type: chartTypesEnum('type').notNull(),
    config: json('config').notNull(),
  },
  (table) => [
    uniqueIndex('chart_base_config_pkey').on(table.id),
    uniqueIndex('chart_base_config_type_key').on(table.type),
  ]
);

export const chartFeatures = chartwrightDev.table(
  'chart_features',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    type: chartTypesEnum('type').notNull(),
    config: json('config').notNull(),
  },
  (table) => [
    uniqueIndex('chart_features_pkey').on(table.id),
    uniqueIndex('chart_features_type_key').on(table.type),
  ]
);

export const chartTemplates = chartwrightDev.table(
  'chart_templates',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    config: json('config').notNull(),
    type: chartTypesEnum('type').notNull(),
    thumbnail: text('thumbnail').notNull(),
    versionNumber: integer('version_number')
      .default(sql`0`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('chart_templates_name_unique').on(table.name),
    uniqueIndex('chart_templates_pkey').on(table.id),
    uniqueIndex('chart_templates_thumbnail_key').on(table.thumbnail),
  ]
);

export const embeddedCharts = chartwrightDev.table(
  'embedded_charts',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    type: embeddedChartTypeEnum('type').notNull(),
    chartId: uuid('chart_id').notNull(),
    createdBy: uuid('created_by').notNull(),
    createdDate: date('created_date').notNull(),
    updatedBy: uuid('updated_by'),
    updatedDate: date('updated_date'),
    expirationDate: date('expiration_date').notNull(),
    lastAccessed: date('last_accessed'),
    versionNumber: integer('version_number')
      .default(sql`0`)
      .notNull(),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('embedded_charts_pkey').on(table.id),
    uniqueIndex('unique_embed_chart_row').on(
      table.type,
      table.chartId,
      table.createdBy
    ),
  ]
);

export const subscriptionPlans = chartwrightDev.table(
  'subscription_plans',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userPlan: userPlansEnum('user_plan')
      .default(sql`'FREE'`)
      .notNull(),
    description: text('description'),
    amount: numeric('amount', { precision: 10, scale: 2 })
      .default(sql`0.00`)
      .notNull(),
    currency: currenciesEnum('currency')
      .default(sql`'USD'`)
      .notNull(),
    userPrivileges: userPrivilegesEnum('user_privileges')
      .array()
      .default([
        'exports_embed_image_5',
        'exports_embed_iframe_5',
        'save_as_pdf_unlimited',
        'save_as_image_unlimited',
        'save_charts_10',
      ])
      .notNull(),
    billingInterval: billingIntervalEnum('billing_interval')
      .default(sql`'MONTHLY'`)
      .notNull(),
    createdDate: date('created_date').defaultNow().notNull(),
    updatedDateDate: date('updated_date_date').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('subscription_plans_pkey').on(table.id)]
);

export const userCharts = chartwrightDev.table(
  'user_charts',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: varchar('title', { length: 50 }).notNull(),
    config: json('config').notNull(),
    chartType: chartTypesEnum('chart_type').notNull(),
    thumbnail: varchar('thumbnail', { length: 50 }).default(sql`NULL`),
    createdBy: uuid('created_by').notNull(),
    createdDate: date('created_date').notNull(),
    updatedBy: uuid('updated_by'),
    updatedDate: date('updated_date'),
    versionNumber: integer('version_number')
      .default(sql`0`)
      .notNull(),
  },
  (table) => [uniqueIndex('user_charts_pkey').on(table.id)]
);

export const userSubscriptions = chartwrightDev.table(
  'user_subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    planId: uuid('plan_id').notNull(),
    userStatus: userStatusEnum('user_status')
      .default(sql`'ACTIVE'`)
      .notNull(),
    startDate: timestamp('start_date', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    endDate: timestamp('end_date', { withTimezone: true, mode: 'string' }),
    trialEnd: timestamp('trial_end', { withTimezone: true, mode: 'string' }),
    cancelledByAdminAt: timestamp('cancelled_by_admin_at', {
      withTimezone: true,
      mode: 'string',
    }),
    cancelledAt: timestamp('cancelled_at', {
      withTimezone: true,
      mode: 'string',
    }),
    autoRenew: boolean('auto_renew').default(sql`false`),
    paymentGateway: jsonb('payment_gateway'),
    lastPaymentAt: timestamp('last_payment_at', {
      withTimezone: true,
      mode: 'string',
    }),
    nextPaymentAt: timestamp('next_payment_at', {
      withTimezone: true,
      mode: 'string',
    }),
    renewalCount: integer('renewal_count').default(sql`0`),
    createdDate: date('created_date').notNull(),
    updatedDate: date('updated_date'),
    metadata: jsonb('metadata'),
  },
  (table) => [uniqueIndex('user_subscriptions_pkey').on(table.id)]
);

export const users = chartwrightDev.table(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userName: text('user_name').notNull(),
    cognitoId: text('cognito_id').notNull(),
    email: text('email').notNull(),
    createdDate: date('created_date').notNull(),
    updatedDate: date('updated_date'),
    superUser: boolean('super_user').default(sql`false`),
    userPrivileges: userPrivilegesEnum('user_privileges')
      .array()
      .default([
        'exports_embed_image_5',
        'exports_embed_iframe_5',
        'save_as_pdf_unlimited',
        'save_as_image_unlimited',
        'save_charts_10',
      ])
      .notNull(),
  },
  (table) => [
    uniqueIndex('users_cognito_id_key').on(table.cognitoId),
    uniqueIndex('users_email_key').on(table.email),
    uniqueIndex('users_pkey').on(table.id),
    uniqueIndex('users_user_name_key').on(table.userName),
  ]
);

export const embeddedChartsRelations = relations(embeddedCharts, ({ one }) => ({
  userCharts: one(userCharts, {
    fields: [embeddedCharts.chartId],
    references: [userCharts.id],
  }),
  users: one(users, {
    fields: [embeddedCharts.createdBy],
    references: [users.id],
  }),
}));

export const userChartsRelations = relations(userCharts, ({ one, many }) => ({
  embeddedCharts: many(embeddedCharts),
  chartFeatures: one(chartFeatures, {
    fields: [userCharts.chartType],
    references: [chartFeatures.type],
  }),
  users_createdBy: one(users, {
    fields: [userCharts.createdBy],
    references: [users.id],
    relationName: 'userCharts_createdBy_users_id',
  }),
  users_updatedBy: one(users, {
    fields: [userCharts.updatedBy],
    references: [users.id],
    relationName: 'userCharts_updatedBy_users_id',
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  embeddedCharts: many(embeddedCharts),
  userCharts_createdBy: many(userCharts, {
    relationName: 'userCharts_createdBy_users_id',
  }),
  userCharts_updatedBy: many(userCharts, {
    relationName: 'userCharts_updatedBy_users_id',
  }),
  userSubscriptions: many(userSubscriptions),
}));

export const chartFeaturesRelations = relations(chartFeatures, ({ many }) => ({
  userCharts: many(userCharts),
}));

export const userSubscriptionsRelations = relations(
  userSubscriptions,
  ({ one }) => ({
    subscriptionPlans: one(subscriptionPlans, {
      fields: [userSubscriptions.planId],
      references: [subscriptionPlans.id],
    }),
    users: one(users, {
      fields: [userSubscriptions.userId],
      references: [users.id],
    }),
  })
);

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ many }) => ({
    userSubscriptions: many(userSubscriptions),
  })
);
