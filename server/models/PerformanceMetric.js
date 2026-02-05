const FirestoreModel = require('./FirestoreModel');

class PerformanceMetric extends FirestoreModel {
    static get collectionName() {
        return 'performance_metrics';
    }
}

PerformanceMetric.associate = (models) => { };

module.exports = PerformanceMetric;
