const pool = require("../database") 

// Register new classification
async function createNewClassification(){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) returning *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

module.exports = (createNewClassification)