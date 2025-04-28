export type FindAll<T> = {
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
  data: T[];
}