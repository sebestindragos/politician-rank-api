import * as mariadb from "mariadb";
import { IRepository } from "./IRepository";

export class MySqlRepository<T> implements IRepository<T> {
  /**
   * Class constructor.
   */
  constructor(private _pool: mariadb.Pool, private _tableName: string) {}

  async insertOne(value: T) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this._pool.getConnection();

      let newItem = Object.assign({}, value);
      // delete (newItem as any).id;

      const result = await conn.query(
        `INSERT INTO \`${this._tableName}\` value (${Object.keys(newItem)
          .map(() => "?")
          .join(", ")})`,
        Object.values(newItem)
      );
      result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async findOne(query: Partial<T>) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this._pool.getConnection();
      const whereClause = Object.keys(query)
        .map(key => `${key}='${(query as any)[key]}'`)
        .join(", ");
      const result = await conn.query(
        `SELECT * from ${this._tableName} WHERE ${whereClause} LIMIT 1`
      );

      return result[0];
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async find(
    query: Partial<T>,
    options?: {
      cursor?: any;
      limit?: number;
    }
  ) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this._pool.getConnection();
      let q = `SELECT * from ${this._tableName}`;

      // compute where clause
      if (Object.keys(query).length > 0) {
        const whereClause = Object.keys(query)
          .map(key => `${key}='${(query as any)[key]}'`)
          .join(", ");
        q += ` WHERE ${whereClause}`;
      }

      // apply options
      if (options && options.limit) q += ` LIMIT ${options.limit}`;

      const result = await conn.query(q);

      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}
