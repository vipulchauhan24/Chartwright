import { Client } from 'pg';

const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } = process.env;

export class PostgresORM {
  constructor() {
    this.pgClient = new Client({
      user: DB_USER,
      password: DB_PASS,
      host: DB_HOST,
      port: Number(DB_PORT),
      database: DB_NAME,
    });
  }

  async runQuery(query: string, values: Array<string>) {
    await this.pgClient.connect();
    const result = await this.pgClient.query(query, values);
    await this.pgClient.end();
    return result.rows[0];
  }

  /**
   * PRIVATE CLASS METHODS AND VARIABLE
   */
  private pgClient;
}
