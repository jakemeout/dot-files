"use strict";
// Create a Common DB Connection library both
// the language server and the client can use
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgClient = void 0;
const pg_1 = require("pg");
class PgClient extends pg_1.Client {
    constructor(config) {
        super(config);
        this.is_ended = false;
        this.on('end', () => {
            this.is_ended = true;
        });
    }
}
exports.PgClient = PgClient;
//# sourceMappingURL=connection.js.map