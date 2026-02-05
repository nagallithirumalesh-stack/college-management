const { db } = require('../config/firebase');
const {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit
} = require('firebase/firestore');

class FirestoreModel {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.db = db;
    }

    // --- Helpers ---
    getCollectionRef() {
        return collection(this.db, this.collectionName);
    }

    getDocRef(id) {
        return doc(this.db, this.collectionName, id);
    }

    // --- Static Methods (to be called via instance wrapper or strict static if refactored) ---
    // Since JS classes don't easily allow "static inheritance" with 'this.collectionName' set on child, 
    // we will stick to the pattern used in User.js but make it cleaner, 
    // OR we instantiate a "Service" for each model.
    // simpler: Let's make this class methods static but accept collection name?
    // No, standard Sequelize usage is `Model.create()`. 
    // Let's genericize the User.js pattern.

    static init(data, id) {
        // Factory method to return instance
        return new this(data, id);
    }
}

// Better approach:
// Models verify "User.findAll".
// We can create a base class that models extend, setting a static 'collectionName'.

class Model {
    constructor(data, id) {
        this.id = id;
        Object.assign(this, data);
        // Timestamps
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    static get collectionName() {
        throw new Error('Collection name must be defined in child class');
    }

    static async create(data) {
        try {
            const colRef = collection(db, this.collectionName);

            // Add timestamps
            const now = new Date().toISOString();
            const payload = { ...data, createdAt: now, updatedAt: now };

            const docRef = await addDoc(colRef, payload);
            return new this(payload, docRef.id);
        } catch (error) {
            console.error(`Error creating ${this.collectionName}:`, error);
            throw error;
        }
    }

    static async findByPk(id) {
        try {
            if (!id) return null;
            const docRef = doc(db, this.collectionName, id);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                return new this(snapshot.data(), snapshot.id);
            }
            return null;
        } catch (error) {
            console.error(`Error finding ${this.collectionName} by pk:`, error);
            throw error;
        }
    }

    static async findAll(options = {}) {
        try {
            const colRef = collection(db, this.collectionName);
            let q = query(colRef);

            // Simple WHERE support
            if (options.where) {
                Object.keys(options.where).forEach(key => {
                    const val = options.where[key];
                    if (val !== undefined) {
                        q = query(q, where(key, '==', val));
                    }
                });
            }

            // Order support (basic)
            if (options.order) {
                // Sequelize format: [['field', 'DESC']]
                const orderArr = options.order[0];
                if (orderArr) {
                    q = query(q, orderBy(orderArr[0], orderArr[1].toLowerCase()));
                }
            }

            // Limit
            if (options.limit) {
                q = query(q, limit(options.limit));
            }

            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => new this(d.data(), d.id));
        } catch (error) {
            console.error(`Error finding all ${this.collectionName}:`, error);
            // Return empty array instead of throwing to be safe? No, let's throw.
            throw error;
        }
    }

    static async findOne(options = {}) {
        // Same as findAll but limit 1
        const results = await this.findAll({ ...options, limit: 1 });
        return results.length > 0 ? results[0] : null;
    }

    static async update(data, options) {
        // Sequelize bulk update
        // Not supporting bulk update easily in firestore without batch
        // Warning: this is often used as `Model.update({ status: 'active'}, { where: { id: 1 } })`
        // We will implement basic loop
        const items = await this.findAll(options);
        const promises = items.map(async (item) => {
            const docRef = doc(db, this.collectionName, item.id);
            const now = new Date().toISOString();
            await updateDoc(docRef, { ...data, updatedAt: now });
            return new this({ ...item, ...data }, item.id);
        });
        return await Promise.all(promises);
    }

    static async destroy(options) {
        // Bulk delete
        const items = await this.findAll(options);
        const promises = items.map(item => deleteDoc(doc(db, this.collectionName, item.id)));
        await Promise.all(promises);
        return items.length;
    }

    // Instance methods
    async save() {
        const docRef = doc(db, this.constructor.collectionName, this.id);
        const payload = { ...this };
        delete payload.id; // Don't save ID in data
        payload.updatedAt = new Date().toISOString();
        await updateDoc(docRef, payload);
        return this;
    }

    async destroy() {
        await deleteDoc(doc(db, this.constructor.collectionName, this.id));
    }

    // Stub for associate to prevent crashes
    static associate(models) { }

    toJSON() {
        return { ...this };
    }
}

module.exports = Model;
