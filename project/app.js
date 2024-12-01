// app.js
import { Hono } from "https://deno.land/x/hono/mod.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

// Middleware lisäämään tietoturvaotsikot
app.use('*', async (c, next) => {
  // Lisää Content-Security-Policy (CSP)
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
  
  // Lisää Anti-MIME-sniffing-otsikko
  c.header('X-Content-Type-Options', 'nosniff');
  
  // Lisää Anti-clickjacking-otsikko
  c.header('X-Frame-Options', 'DENY');
  
  // Siirry seuraavaan reittiin
  await next();
});

// Serve the registration form
app.get('/register', async (c) => {
  return c.html(await Deno.readTextFile('./views/register.html'));
});

// Route for user registration (POST request)
app.post('/register', registerUser);

Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js

