const db = require('../config/db');

// ✅ Fetch all expenses of the logged-in user with pagination
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 10; // ✅ Number of expenses per page
        const offset = (page - 1) * limit; // Calculate the offset

        // Get total number of expenses
        const [totalExpenses] = await db.query(
            'SELECT COUNT(*) AS total FROM expenses WHERE user_id = ?',
            [userId]
        );
        const total = totalExpenses[0].total;
        const totalPages = Math.ceil(total / limit); // Calculate total pages

        // Fetch expenses with pagination
        const [expenses] = await db.query(
            `SELECT id, amount, description, category, 
                    DATE_FORMAT(created_at, "%Y-%m-%d") AS date, 
                    DATE_FORMAT(created_at, "%H:%i:%s") AS time 
             FROM expenses 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        res.status(200).json({
            expenses,
            page,
            totalPages,
            total,
            limit // ✅ Include limit in the response
        });
    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Add a new expense
exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Insert the new expense
        await db.query(
            'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)',
            [userId, amount, description, category]
        );

        // Update total expense in `users` table
        await db.query(
            'UPDATE users SET total_expense = total_expense + ? WHERE id = ?',
            [amount, userId]
        );

        res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
        console.error("❌ Error adding expense:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const expenseId = req.params.id;
        const userId = req.user.id;

        console.log(`🔍 Deleting Expense ID: ${expenseId} for User ID: ${userId}`);

        // Fetch the expense amount before deleting
        const [expense] = await db.query("SELECT amount FROM expenses WHERE id = ? AND user_id = ?", [expenseId, userId]);
        if (!expense.length) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const amountToSubtract = expense[0].amount;

        // Delete the expense
        await db.query("DELETE FROM expenses WHERE id = ? AND user_id = ?", [expenseId, userId]);

        // Update the total_expense column in the users table
        await db.query("UPDATE users SET total_expense = total_expense - ? WHERE id = ?", [amountToSubtract, userId]);

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting expense:", error);
        res.status(500).json({ message: "Server error while deleting expense", error });
    }
};

// ✅ Fetch leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const [leaderboard] = await db.query(
            `SELECT name, total_expense 
             FROM users 
             ORDER BY total_expense DESC, id ASC`
        );

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Helper function to fetch aggregated expenses
// Helper function to fetch aggregated expenses
async function getAggregatedExpenses(req, res, aggregationType) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let groupByClause;
        let dateFormat;
        let orderByClause;
        let selectDateFormat;
        let whereClause = '';  // Add a whereClause variable

        switch (aggregationType) {
            case 'daily':
                groupByClause = 'DATE(created_at)';
                dateFormat = '%Y-%m-%d';
                orderByClause = 'DATE(created_at) DESC';
                selectDateFormat = 'DATE(created_at) AS date';
                whereClause = 'AND DATE(created_at) = CURDATE()'; // Filter for today
                break;
            case 'weekly':
                groupByClause = 'WEEK(created_at)';
                dateFormat = '%Y-W%U';
                orderByClause = 'WEEK(created_at) DESC';
                selectDateFormat = 'DATE_FORMAT(created_at, "%Y-W%U") AS date';
                whereClause = 'AND created_at BETWEEN CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) + 6) DAY AND CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY'; // Filter for the current week
                break;
            case 'monthly':
                groupByClause = 'MONTH(created_at)';
                dateFormat = '%Y-%m';
                orderByClause = 'MONTH(created_at) DESC';
                selectDateFormat = 'DATE_FORMAT(created_at, "%Y-%m") AS date';
                whereClause = 'AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())'; // Filter for the current month
                break;
            default:
                return res.status(400).json({ message: "Invalid aggregation type" });
        }

        // Get total number of aggregated expenses
        const [totalAggregated] = await db.query(
            `SELECT COUNT(DISTINCT ${groupByClause}) AS total FROM expenses WHERE user_id = ? ${whereClause}`,
            [userId]
        );

        const total = totalAggregated[0].total;
        const totalPages = Math.ceil(total / limit);

        // Fetch aggregated expenses with pagination
        const [aggregatedExpenses] = await db.query(
            `SELECT ${selectDateFormat}, 
                    SUM(amount) AS amount, 
                    description, 
                    category, 
                    DATE_FORMAT(MIN(created_at), "%H:%i:%s") AS time,
                    MIN(id) AS id  -- Include the expense id
             FROM expenses
             WHERE user_id = ? ${whereClause}
             GROUP BY ${groupByClause}, description, category
             ORDER BY ${orderByClause}
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        res.status(200).json({
            expenses: aggregatedExpenses,
            page,
            totalPages,
            total,
            limit
        });

    } catch (error) {
        console.error(`❌ Error fetching ${aggregationType} expenses:`, error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// ✅ Fetch daily expenses
exports.getDailyExpenses = async (req, res) => {
    await getAggregatedExpenses(req, res, 'daily');
};

// ✅ Fetch weekly expenses
exports.getWeeklyExpenses = async (req, res) => {
    await getAggregatedExpenses(req, res, 'weekly');
};

// ✅ Fetch monthly expenses
exports.getMonthlyExpenses = async (req, res) => {
    await getAggregatedExpenses(req, res, 'monthly');
};