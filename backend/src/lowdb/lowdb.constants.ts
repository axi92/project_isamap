import { DataBaseStructure } from './lowdb.interface';

export const defaultData: DataBaseStructure = { users: [], servers: [] };
export const WARN_SAVING_DB_SHUTDOWN = 'Saving databases on shutdown!';
export const WARN_SAVING_DB_SHUTDOWN_COMPLETE =
  'Saving databases on shutdown complete!';
export const COLLECTION = {
  SERVERS: 'servers',
  USERS: 'users',
};
export const DB_FILENAME = 'test-db.json';
