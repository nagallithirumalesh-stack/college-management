const FirestoreModel = require('./FirestoreModel');

class Todo extends FirestoreModel {
    static get collectionName() {
        return 'todos';
    }
}

Todo.associate = (models) => { };

module.exports = Todo;
