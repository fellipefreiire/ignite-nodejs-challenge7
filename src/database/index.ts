import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'database_fin_api'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host,
      database: process.env.NODE_ENV === 'test' ? 'fin_api_test' : defaultOptions.database,
    }),
  );
};
