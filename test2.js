const fetch = require('node-fetch');
const fs = require('fs');

async function test() {
  try {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test12345@example.com', password: 'password123', name: 'Test User', role: 'NGO Admin' })
    });
    const text = await res.text();
    fs.writeFileSync('f:/projects/New folder/debug.log', "Status: " + res.status + "\nResponse: " + text);
  } catch (err) {
    fs.writeFileSync('f:/projects/New folder/debug.log', "Catch Error: " + err.message);
  }
}

test();
