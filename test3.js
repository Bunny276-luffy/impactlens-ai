const fetch = require('node-fetch');
const fs = require('fs');

async function test() {
  try {
    const res = await fetch('https://jzbhtieopwueeqtdsfcn.supabase.co/auth/v1/signup', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'apikey': 'sb_publishable_c3lBraT5Kz54jixgNAgIAw_HjpE0TuP'
      },
      body: JSON.stringify({ email: 'test123456@example.com', password: 'password123', data: { name: 'Test', role: 'NGO Admin' } })
    });
    const text = await res.text();
    fs.writeFileSync('f:/projects/New folder/debug.log', "Status: " + res.status + "\nResponse: " + text);
  } catch (err) {
    fs.writeFileSync('f:/projects/New folder/debug.log', "Catch Error: " + err.message);
  }
}

test();
