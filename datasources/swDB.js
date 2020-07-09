const { DataSource } = require("apollo-datasource");

class SWDB extends DataSource {
    constructor(db) {
        super();

        this.db = db;
    }

    async getWikis() {
        return await this.db.sw.findDoc({});
    }

    async getWiki(name) {
        const wiki = await this.db.sw.findDoc({ name: name });
        return (wiki.length == 0 ? null : wiki[0]);
    }

    async addWiki(wiki) {
        return await this.db.saveDoc("sw", wiki);
    }

    async editWiki(wiki) {
        const ok = await this.db.sw.updateDoc(wiki.id, wiki).then(data => {
            if(data != null) {
                return data;
            } else {
                return new Error("item not found");
            }
        });
        return ok;
    }

    async deleteWiki(id) {
        const ok = await this.db.sw.destroy({ id: id }).then(data => {
            if(data.length > 0) {
                return { ok: true };
            } else {
                return new Error("item not found");
            }
        });

        return ok;
    }
}

module.exports = SWDB;