const { db } = require('../config/firebase');
const { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, or } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

const USERS_COLLECTION = 'users';

class User {
    constructor(data, id) {
        this.id = id;
        this._id = id; // For compatibility
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'student';
        this.department = data.department;
        this.semester = data.semester;
        this.section = data.section || 'A';
        this.username = data.username;
        this.rollNo = data.rollNo;
        // Gamification
        this.points = data.points || 0;
        this.band = data.band || 'Bronze';
        this.badges = data.badges || [];
        this.profilePhoto = data.profilePhoto;

        // Timestamps (handled manually or by firestore if configured)
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    // Static Sequelize-like methods

    static async findOne(options) {
        try {
            const usersRef = collection(db, USERS_COLLECTION);
            let q;

            // Handle where clause
            if (options && options.where) {
                // Determine if this is a simple email lookup or generic
                // Or check for Op.or (Sequelize operator)
                // Note: The controller passes { where: { email } } or { where: { [Op.or]: ... } }

                const whereClause = options.where;

                // Check for Op.or / Symbol
                const symbolKeys = Object.getOwnPropertySymbols(whereClause);

                if (symbolKeys.length > 0) {
                    // Likely Op.or
                    // In the controller: [Op.or]: [{ email: email }, { username: email }]
                    // We can't easily access the Symbol(or) from here without importing Op.
                    // But we can check the values.
                    const orConditions = whereClause[symbolKeys[0]];
                    if (Array.isArray(orConditions)) {
                        // Simplify: Just check email OR username
                        // Firestore 'or' query requires 'or' import
                        const conditions = [];
                        for (const cond of orConditions) {
                            if (cond.email) conditions.push(where('email', '==', cond.email));
                            if (cond.username) conditions.push(where('username', '==', cond.username));
                        }
                        if (conditions.length > 0) {
                            q = query(usersRef, or(...conditions));
                        }
                    }
                } else if (whereClause.email) {
                    q = query(usersRef, where('email', '==', whereClause.email));
                } else if (whereClause.username) {
                    q = query(usersRef, where('username', '==', whereClause.username));
                } else if (whereClause.id) {
                    // ID lookup via findOne
                    return await this.findByPk(whereClause.id);
                } else {
                    // Fallback for other single fields
                    const key = Object.keys(whereClause)[0];
                    if (key) {
                        q = query(usersRef, where(key, '==', whereClause[key]));
                    }
                }
            }

            if (!q) return null;

            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) return null;

            const docSnap = querySnapshot.docs[0];
            return new User(docSnap.data(), docSnap.id);

        } catch (error) {
            console.error("Error in User.findOne:", error);
            throw error;
        }
    }

    static async findByPk(id, options) {
        // Options usually contain attributes include/exclude, ignored for now
        try {
            if (!id) return null;
            const docRef = doc(db, USERS_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return new User(docSnap.data(), docSnap.id);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in User.findByPk:", error);
            throw error;
        }
    }

    static async findAll(options) {
        try {
            const usersRef = collection(db, USERS_COLLECTION);
            let q = query(usersRef);

            // Limited support for where in findAll for now
            if (options && options.where) {
                const key = Object.keys(options.where)[0];
                if (key) {
                    q = query(usersRef, where(key, '==', options.where[key]));
                }
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => new User(doc.data(), doc.id));
        } catch (error) {
            console.error("Error in User.findAll:", error);
            throw error;
        }
    }

    static async count(options) {
        try {
            // Basic count implementation (fetches docs, expensive but works for small scale)
            const users = await this.findAll(options);
            return users.length;
        } catch (error) {
            return 0;
        }
    }

    static async create(data) {
        try {
            // Hash password before saving
            // Use hooks logic: if data.password exists
            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            // Set defaults
            if (!data.points) data.points = 0;
            if (!data.band) data.band = 'Bronze';
            if (!data.badges) data.badges = [];

            data.createdAt = new Date().toISOString();
            data.updatedAt = new Date().toISOString();

            const docRef = await addDoc(collection(db, USERS_COLLECTION), data);

            // Return instance
            return new User(data, docRef.id);
        } catch (error) {
            console.error("Error in User.create:", error);
            throw error;
        }
    }

    // Instance Methods

    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }

    async save() {
        try {
            const docRef = doc(db, USERS_COLLECTION, this.id);
            const updateData = { ...this };
            delete updateData.id; // Don't save ID inside doc if not needed, or redundant
            delete updateData._id;
            updateData.updatedAt = new Date().toISOString();

            await updateDoc(docRef, updateData);
            return this;
        } catch (error) {
            throw error;
        }
    }

    async destroy() {
        try {
            await deleteDoc(doc(db, USERS_COLLECTION, this.id));
        } catch (error) {
            throw error;
        }
    }

    // Helper to return plain object for JSON response
    toJSON() {
        return { ...this };
    }
}

module.exports = User;
