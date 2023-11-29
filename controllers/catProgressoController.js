const pool = require('../database');
const queries = require('../queries');

const getAllCategories = async(req, res) => {
    const categories = (await pool.query(queries.getAllCategories)).rows
    res.status(200).json({categories})
}

module.exports = {
    getAllCategories
}