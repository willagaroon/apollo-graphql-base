const { DataSource } = require("apollo-datasource");

class SWDB extends DataSource {
    constructor(db) {
        super();

        this.db = db;
    }

    async getAllDocs(table) {
        return await this.db[table].findDoc({});
    }

    async getOneDoc(table, query) {
        const doc = await this.db[table].findDoc(query);
        return (doc.length == 0 ? null : doc[0]);
    }

    async addDoc(table, doc) {
        return await this.db[table].saveDoc(doc);
    }

    async editDoc(table, id, doc) {
        const ok = await this.db[table].updateDoc(id, doc).then(data => {
            if(data != null) {
                return data;
            } else {
                return new Error(`No document found for id: ${id} in table: ${table}`);
            }
        });
        return ok;
    }

    async deleteDoc(table, id) {
        const ok = await this.db[table].destroy({ id: id }).then(data => {
            if(data.length > 0) {
                return { ok: true };
            } else {
                return new Error(`No document found for id: ${id} in table: ${table}`);
            }
        });

        return ok;
    }
}

module.exports = SWDB;