const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test', role: 'NGO Admin' })
    });
    const text = await res.text();
    console.log("RESPONSE:", text);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
