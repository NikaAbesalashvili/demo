import { DataSource, DataSourceOptions } from "typeorm";
import { Task } from "./tasks/tasks.entity";
import { User } from "./users/user.entity";

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: 'root',
    database: 'postgres',
    entities: [Task, User],
    migrations: ['dist/migrations/*.js'],
    synchronize: true
};

export const dataSource = new DataSource(dataSourceOptions);
export default dataSourceOptions;
