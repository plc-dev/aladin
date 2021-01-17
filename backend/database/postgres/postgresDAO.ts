import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "./../../.env" });

export class PgClient {
    private connectionString: string = "postgresql://admin:admin@postgres:5432/"; //`${process.env.postgresConnection}/`;
    private pool: Pool;

    constructor(dbName?: string) {
        if (!dbName) dbName = "aladin";
        this.connectionString += dbName;

        this.pool = new Pool({ connectionString: this.connectionString });
    }

    public async queryDB(query: string) {
        return await this.pool.query(query);
    }

    public async tearDown() {
        await this.pool.end();
    }
}
