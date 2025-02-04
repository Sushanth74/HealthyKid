import { createConnection } from 'mysql';

// Update with InfinityFree MySQL details
const connection = createConnection({
  host: 'sql112.infinityfree.com', // ✅ Replace with your actual InfinityFree MySQL hostname
  user: 'if0_38244027',        // ✅ Replace with your actual InfinityFree MySQL username
  password: 'leTn6aWTeQDtp',    // ✅ Replace with your actual InfinityFree MySQL password
  database: 'if0_38244027_healthdatabase',        // ✅ Replace with your actual InfinityFree MySQL database name
  port: 3306                       // ✅ Default MySQL port
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

export default connection;
