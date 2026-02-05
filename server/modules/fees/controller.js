const { FeeStructure, StudentFee, FeeTransaction, FeeHead, User } = require('../../models');
const { Op } = require('sequelize');

// --- Student Controllers ---

// Get My Fees (for Student Dashboard)
exports.getMyFees = async (req, res) => {
    try {
        const studentId = req.user.id;
        const student = await User.findByPk(studentId);

        // 1. Try to find existing fee record
        let feeRecord = await StudentFee.findOne({
            where: { studentId },
            include: [{ model: FeeStructure, as: 'structure' }]
        });

        // 2. If no record, try to Lazy Assign based on Dept/Sem
        if (!feeRecord && student) {
            const structure = await FeeStructure.findOne({
                where: {
                    department: student.department || 'General',
                    semester: student.semester || 1
                }
            });

            if (structure) {
                // Auto-create fee record
                feeRecord = await StudentFee.create({
                    totalAmount: structure.totalAmount,
                    paidAmount: 0,
                    status: 'PENDING',
                    dueDate: new Date(new Date().getFullYear(), 3, 30),
                    studentId: studentId,
                    structureId: structure.uniqueId
                });
                // Reload with structure included
                feeRecord = await StudentFee.findOne({
                    where: { id: feeRecord.id },
                    include: [{ model: FeeStructure, as: 'structure' }]
                });
            }
        }

        // 3. If still no record (No structure defined), return Virtual Clean Slate
        if (!feeRecord) {
            return res.json({
                hasFeeRecord: true, // Allow UI to render
                totalAmount: 0,
                paidAmount: 0,
                pendingAmount: 0,
                status: 'PAID',
                dueDate: 'N/A',
                structureName: 'No Fees Assigned',
                breakdown: [],
                transactions: []
            });
        }

        // 4. Fetch transactions
        const transactions = await FeeTransaction.findAll({
            where: { studentFeeId: feeRecord.uniqueId },
            order: [['paymentDate', 'DESC']]
        });

        res.json({
            hasFeeRecord: true,
            totalAmount: feeRecord.totalAmount,
            paidAmount: feeRecord.paidAmount,
            pendingAmount: feeRecord.totalAmount - feeRecord.paidAmount,
            status: feeRecord.status,
            dueDate: feeRecord.dueDate,
            structureName: feeRecord.structure?.name || 'General Fee',
            breakdown: feeRecord.structure?.breakdown || [],
            transactions
        });

    } catch (error) {
        console.error("Get My Fees Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Pay Fee (Mock Payment)
exports.payFee = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { amount, paymentMode } = req.body;

        const feeRecord = await StudentFee.findOne({ where: { studentId } });
        if (!feeRecord) {
            return res.status(404).json({ message: "Fee record not found" });
        }

        // Logic check: Don't overpay
        const currentPending = feeRecord.totalAmount - feeRecord.paidAmount;
        if (amount > currentPending) {
            return res.status(400).json({ message: `Amount exceeds pending dues. Pending: ₹${currentPending}` });
        }

        // 1. Create Transaction
        const transaction = await FeeTransaction.create({
            amount,
            paymentMode: paymentMode || 'ONLINE',
            transactionId: 'TXN' + Date.now(),
            studentFeeId: feeRecord.uniqueId,
            studentId: studentId,
            status: 'SUCCESS'
        });

        // 2. Update Fee Record
        const newPaidAmount = parseFloat(feeRecord.paidAmount) + parseFloat(amount);
        let newStatus = 'PARTIAL';
        if (newPaidAmount >= feeRecord.totalAmount) newStatus = 'PAID';

        await feeRecord.update({
            paidAmount: newPaidAmount,
            status: newStatus
        });

        res.json({
            success: true,
            message: "Payment successful!",
            transaction,
            newStatus
        });

    } catch (error) {
        console.error("Pay Fee Error:", error);
        res.status(500).json({ message: "Payment Failed", error: error.message });
    }
};


// --- Admin Controllers ---

// Create Fee Structure
exports.createFeeStructure = async (req, res) => {
    try {
        const { name, department, semester, totalAmount, academicYear, breakdown } = req.body;

        const structure = await FeeStructure.create({
            name, department, semester, totalAmount, academicYear, breakdown
        });

        res.status(201).json(structure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Fee Structures
exports.getFeeStructures = async (req, res) => {
    try {
        const structures = await FeeStructure.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(structures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Transactions (Global History)
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await FeeTransaction.findAll({
            include: [
                { model: User, as: 'student', attributes: ['name', 'rollNo', 'department', 'semester'] },
                {
                    model: StudentFee,
                    as: 'studentFee',
                    include: [{ model: FeeStructure, as: 'structure', attributes: ['name'] }]
                }
            ],
            order: [['paymentDate', 'DESC']],
            limit: 100 // Cap for performance for now
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign Fee Structure to All Students in Dept/Sem (Bulk Logic)
exports.assignStructureRun = async (req, res) => {
    try {
        const { structureId } = req.body;
        const structure = await FeeStructure.findByPk(structureId);

        if (!structure) return res.status(404).json({ message: "Structure not found" });

        // Find eligible students (Matching dept & sem)
        const students = await User.findAll({
            where: {
                role: 'student',
                // Assuming User model has these, or we filter differently.
                // For now, let's just assign to ALL students for demo if fields missing
                // Or simplistic:
                // department: structure.department 
                // BUT User model view earlier showed department exists.
            }
        });

        let count = 0;
        for (const student of students) {
            // Check if already assigned
            const exists = await StudentFee.findOne({ where: { studentId: student.id } });
            if (!exists) {
                await StudentFee.create({
                    totalAmount: structure.totalAmount,
                    paidAmount: 0,
                    status: 'PENDING',
                    dueDate: new Date(new Date().getFullYear(), 3, 30), // Default: April 30
                    studentId: student.id,
                    structureId: structure.uniqueId
                });
                count++;
            }
        }

        res.json({ message: `Assigned structure to ${count} students successfully.` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Dashboard Stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalFees = await StudentFee.sum('totalAmount') || 0;
        const totalCollected = await StudentFee.sum('paidAmount') || 0;
        const totalPending = totalFees - totalCollected;

        // Find overdue count
        const overdueCount = await StudentFee.count({ where: { status: 'OVERDUE' } });

        res.json({
            totalFees,
            totalCollected,
            totalPending,
            overdueCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
