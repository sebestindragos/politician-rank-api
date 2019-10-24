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
    function wrap(value: any) {
      if (typeof value === "number") return value;
      return `${value}`;
    }

    try {
      conn = await this._pool.getConnection();
      const whereClause = Object.keys(query)
        .map(key => `${key}='${wrap((query as any)[key])}'`)
        .join(" AND ");
      const result = await conn.query(
        `SELECT * from \`${this._tableName}\` WHERE ${whereClause} LIMIT 1`
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
          .join(" AND ");
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

  async updateOne(query: Partial<T>, update: Partial<T>): Promise<void> {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await this._pool.getConnection();
      let q = `UPDATE \`${this._tableName}\``;

      if (Object.keys(update).length === 0)
        throw new Error("Must provide at least one update field.");

      // const setClause = Object.keys(update)
      //   .map(key => `${key}='${(update as any)[key]}'`)
      //   .join(",");
      const setClause = this._getQuery(update, ",");
      q += ` SET ${setClause}`;

      // compute where clause
      if (Object.keys(query).length > 0) {
        const whereClause = Object.keys(query)
          .map(key => `${key}='${(query as any)[key]}'`)
          .join(" AND ");
        q += ` WHERE ${whereClause}`;
      }

      const result = await conn.query(q);

      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  private _getQuery(input: any, separator: string = ",") {
    function wrap(value: any) {
      if (typeof value === "number") return value;
      return `${value}`;
    }

    const mysql = Object.keys(input)
      .map(key => `${key}='${wrap((input as any)[key])}'`)
      .join(separator);

    return mysql;
  }
}
