import { Hono } from "https://deno.land/x/hono/mod.ts";
import { loginUser } from "./routes/login.js"; // Import login logic
import { registerUser } from "./routes/register.js"; // Import register logic
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";

const app = new Hono();

// Middleware turvallisuusotsikoiden lisäämiseen
app.use('*', async (c, next) => {
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self';");
  c.header('X-Frame-Options', 'DENY'); // Estää clickjackingin
  c.header('X-Content-Type-Options', 'nosniff'); // Estää MIME-sniffingin
  await next();
});

// Staattisten tiedostojen reititys
app.use('/static/*', serveStatic());

// Serve the index page (juurireitti)
app.get('/', async (c) => {   
    return c.html(await Deno.readTextFile('./views/index.html')); 
});

// Serve the index page (vaihtoehtoinen /index-reitti)
app.get('/index', async (c) => {
    return c.html(await Deno.readTextFile('./views/index.html'));
});

// Serve the registration form
app.get('/register', async (c) => {
  return c.html(await Deno.readTextFile('./views/register.html'));
});

// Route for user registration (POST request)
app.post('/register', registerUser);

// Serve login page
app.get('/login', async (c) => {
    return c.html(await Deno.readTextFile('./views/login.html'));
});

// Handle user login
app.post('/login', loginUser);

Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js
