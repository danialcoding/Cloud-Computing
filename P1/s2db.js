const { Pool } = require('pg');
const path = require('path');
const {config,getSQLQueryByName} = require('./dbconfig');

const filePath = path.join(__dirname, 'queries.sql');

const pool = new Pool(config);

async function runQuery(queryName,params) {
    let client;
    try {
        client = await pool.connect()

        console.log('Connected to PostgreSQL database');

        const query = getSQLQueryByName(filePath, queryName);
        const result = await client.query(query,params);
        console.log('SQL query executed successfully.');

        //console.log(result.rows[0]);
    } 
    catch (err) {
        console.error('Error executing SQL query', err);
    } 
    finally {
        if (client) {
            client.release();
            console.log('Database connection closed');
        }    
    }
}

module.exports = {
    runQuery,
};
// const queryTag = 'TEST_DB';

// runQuery(queryTag);