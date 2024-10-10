const fs = require('fs');

const config = {
    user: "avnadmin",
    password: "AVNS_NHBqXg2QSSqmo88CVtQ",
    host: "p1-cloud-db-danialfaraji1382-18f8.d.aivencloud.com",
    port: 13276,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUCkDvlIdAJp89DYT850HCNx7D/MMwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZmI1Njk3OTctZmE3ZC00NTU2LTg1MmMtNzI3ZWM3ZjZh
OWEzIFByb2plY3QgQ0EwHhcNMjQwOTI0MTI1MTIyWhcNMzQwOTIyMTI1MTIyWjA6
MTgwNgYDVQQDDC9mYjU2OTc5Ny1mYTdkLTQ1NTYtODUyYy03MjdlYzdmNmE5YTMg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBALTW+HaO
k4y2fL/QT6mjkyjT2eamYwccr5GJu8E4x/6RlD2tQdcw397608eJx5fvPqUnRBms
+F5OH4fpsd6uW1C/ONWnl927lrwHgemANIj7c1JnD2hDSUtgdE2vvVFcRV30HRWc
x5O3yy9M6g01iq7gtZAsLEOfJ27t4KATD9dD7PimzSDJ1kEfA5dMDUyzfqPTRDFh
vdKKfwt3RJj0kKEMIRUXqnW3LGdHBfuwyrjF6rnaHkc+V5RB2RDft+leAUI4YPZ3
5+XHeduN8u2S2dU7C1bCL8btR91eP+7+6rqaHBxpVdqqd62qHygV0HWN+PTynSIB
ngaUp6HNu3L7r1+HkfQQBozHmOd1Q8zTxObTB8cF5gPWxmHM+kk+d52WRBQK9kNW
NK9yf6OxSkvwA0d+EmdQzUQ5DCRsmajH4Gpv3z7lZODkXPno9ZKZWqsNmOiFPspq
m3hvJqcoaXKYjD+UBfUxbAVWmKvVUbvyM10+YaN9IxuSPhDTynJmOlGc4wIDAQAB
oz8wPTAdBgNVHQ4EFgQUIaIUVSnmkC28JeSpX5RWHhDp9I8wDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBADZudQddAxrZumRb
UVEq2FCoThdzLnEy10plihlvtbTtVbFKjdkFgEnI/4TYliYyFroWXpb5LcQYpOOd
npXLQaJDDvAbFPgd0ObsPlEaW2lWfDBAV6iRE9ly/pP5BKebZoELWobnVbwp8W6b
7jTp1dZ+Wq69753lZ+BcgLCDw5KJ4VVdH70b/q6pA/pPhneJ4URxg5Nf8ZN65uPP
+KDnVfYqXaTGs3BcNU4HUjYTqPBtXhYQYzVAZ6XxcZJiMXYj2m+d9MRvV6hDsSmG
2rmZmXMfz6CUDzydMtZjmzvkEC17w1bVZwN2NRJmzzplnHn9l5CAJBWUKbRbXRWn
GCx5lwTEoCE2WEKP3DjfRiJFOvPm4asP1MugCog2QwqX31GKIMLv7rj5sgZ/zEyj
7EVBUhrZqgJsot5KNRBVK+cMNqxM9TBFiQXSMA4u3jsezszst4T40u3+N8JDi0b9
PHOgmcwhUzGHjVjQ81bIVq4jVQaELW+q4fwwtBnF8EE3W0X4Jw==
-----END CERTIFICATE-----`,
    },
};


function getSQLQueryByName(filePath, tag) {

    const sql = fs.readFileSync(filePath, 'utf8');

    const queries = sql.split(';').map(query => query.trim());

    const query = queries.find(q => q.includes(`-- ${tag}`));

    if (!query) {
        throw new Error(`Query with tag "${tag}" not found in the SQL file`);
    }

    return query;
}

module.exports = {
    config,
    getSQLQueryByName,
}