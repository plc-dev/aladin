import { Pool, QueryResult } from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "./../../.env" });

export class PgClient {
    private connectionString: string = "postgresql://admin:admin@localhost:5432/"; //`${process.env.postgresConnection}/`;
    private pool: Pool;

    constructor(dbName?: string) {
        if (!dbName) dbName = "aladin";
        this.connectionString += dbName;

        this.pool = new Pool({ connectionString: this.connectionString });
    }

    public async queryDB(query: string): Promise<Array<any>> {
        const result: QueryResult = await this.pool.query(query);
        return result.rows;
    }

    public async tearDown() {
        await this.pool.end();
    }
}
