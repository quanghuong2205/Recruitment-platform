import { Model } from 'mongoose';

export class BaseRepository<T> {
  protected repo: Model<T>;

  constructor(repo: Model<T>) {
    this.repo = repo;
  }

  async find(filter: Record<string, any>): Promise<T[]> {
    return this.repo.find(filter);
  }

  async findOne(filter: Record<string, any>): Promise<T> {
    return this.repo.findOne(filter);
  }

  async create(props: Partial<T>): Promise<T> {
    return await this.repo.create(props);
  }

  async updatedOne(
    filter: Record<string, any>,
    updatedProps: Partial<T>,
    options?: Record<string, any>,
  ): Promise<unknown> {
    return await this.repo.updateOne(filter, updatedProps, options);
  }

  async deleteOne(
    filter: Record<string, any>,
    options?: Record<string, any>,
  ): Promise<unknown> {
    return await this.repo.deleteOne(filter, options);
  }

  async findOneAndUpdate(
    filter: Record<string, any>,
    updatedProps: Partial<T>,
    options?: Record<string, any>,
  ): Promise<unknown> {
    return await this.repo.findOneAndUpdate(filter, updatedProps, options);
  }
}
