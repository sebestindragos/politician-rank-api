export interface IRepository<T> {
  insertOne(value: T): Promise<void>;
  findOne(query: Partial<T>): Promise<T | undefined>;
  find(
    query: Partial<T>,
    options?: {
      cursor?: any;
      limit?: number;
    }
  ): Promise<T[]>;
  updateOne(query: Partial<T>, update: Partial<T>): Promise<void>;
  // deleteOne(query: Partial<T>): Promise<boolean>;
}
