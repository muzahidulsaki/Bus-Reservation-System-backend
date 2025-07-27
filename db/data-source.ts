import e from 'express'
import {DataSource, DataSourceOptions} from 'typeorm'
export const dataSourceOptions:DataSourceOptions={


type: 'postgres',
host: 'localhost',
port: 5432,
username: 'postgres',
password: 'system',
database: 'mydatabase',
entities: [],
migrations: [],
logging: false,
synchronize: false,

}

export const dataSource = new DataSource(dataSourceOptions)
export default dataSource
