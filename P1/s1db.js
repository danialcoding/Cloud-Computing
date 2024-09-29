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

        const addTableQuery = getSQLQueryByName(filePath, 'CREATE_TABLE_REQUESTS');    
        const createTableRes = await client.query(addTableQuery);
        console.log('Request Table created successfully.');

        const query = getSQLQueryByName(filePath, queryName);
        const result = await client.query(query,params);
        console.log('SQL query executed successfully.', result.rows);

        //console.log(result.rows[0].id);

        return result;
    } 
    catch (err) {
        //console.error('Error executing SQL query', err.stack);
        throw new Error('Error executing SQL query in s1db: ',err);
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

// runQuery(queryTag,[]);