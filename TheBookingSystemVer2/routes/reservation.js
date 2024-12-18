import { getSession } from "../sessionService.js"; // For sessions
import client from "../db/db.js";

// Get user UUID
async function getUserUUID(username) {
  const result = await client.queryArray(
    `SELECT user_token FROM zephyr_users WHERE username = $1`,
    [username],
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

// Function to get reservations without user info
export async function getReservations() {
  try {
    const query = `
      SELECT resource_name, reservation_start, reservation_end
      FROM zephyr_booked_resources_view;
    `;
    const result = await client.queryObject(query);

    // Generate HTML table rows dynamically
    const tableRows = result.rows
      .map(row => `
        <tr>
          <td>${row.resource_name}</td>
          <td>${new Date(row.reservation_start).toLocaleString()}</td>
          <td>${new Date(row.reservation_end).toLocaleString()}</td>
        </tr>
      `)
      .join("");
    return tableRows;
  } catch (error) {
    console.error("Error fetching booked resources:", error);
    return "";
  }
}

// Function to get reservations with user info
export async function getReservationsWithUser() {
  try {
    const query = `
      SELECT r.resource_name, res.reservation_start, res.reservation_end, u.username AS reserver_username
      FROM zephyr_resources r
      JOIN zephyr_reservations res ON r.resource_id = res.resource_id
      JOIN zephyr_users u ON res.reserver_token = u.user_token;
    `;
    const result = await client.queryObject(query);

    // Generate HTML table rows dynamically
    const tableRows = result.rows
      .map(row => `
        <tr>
          <td>${row.resource_name}</td>
          <td>${new Date(row.reservation_start).toLocaleString()}</td>
          <td>${new Date(row.reservation_end).toLocaleString()}</td>
          <td>${row.reserver_username}</td>
        </tr>
      `)
      .join("");
    return tableRows;
  } catch (error) {
    console.error("Error fetching booked resources:", error);
    return "";
  }
}

// Handle the reservation form
export async function handleReservationForm(req) {
  const session = getSession(req);

  if (!session || !session.username) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Manage Reservations</title>
        <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Create Reservation</h1>
            <form action="/reservation" method="POST">
                <!-- Reserver username (pre-filled) -->
                <div class="form-group">
                    <label for="reserver_token">Reserver username:</label>
                    <input type="text" name="reserver_username" id="reserver_username" value="${session.username}" readonly>
                </div>

                <!-- Other form fields -->
                <div class="form-group">
                    <label for="resource_id">Resource:</label>
                    <select name="resource_id" id="resource_id" required></select>
                </div>
                <div class="form-group">
                    <label for="reservation_start">Reservation Start:</label>
                    <input type="datetime-local" name="reservation_start" id="reservation_start" required>
                </div>
                <div class="form-group">
                    <label for="reservation_end">Reservation End:</label>
                    <input type="datetime-local" name="reservation_end" id="reservation_end" required>
                </div>
                <div class="form-group">
                    <button type="submit">Save Reservation</button>
                </div>
            </form>
        </div>
        <script src="/static/reservations.js"></script>
    </body>
    </html>
    `;

  return new Response(formHtml, {
    headers: { "Content-Type": "text/html" },
  });
}

// Handle the reservation registration
export async function registerReservation(req) {
  const reserverUsername = req.get("reserver_username");
  const resourceId = req.get("resource_id");
  const reservationStart = req.get("reservation_start");
  const reservationEnd = req.get("reservation_end");
  try {
    const userUUID = await getUserUUID(reserverUsername);
    const query =
      `INSERT INTO zephyr_reservations (reserver_token, resource_id, reservation_start, reservation_end) VALUES ($1, $2, $3, $4)`;
    await client.queryArray(query, [
      userUUID[0],
      resourceId,
      reservationStart,
      reservationEnd,
    ]);
    return new Response(null, { status: 302, headers: { Location: "/" } });
  } catch (error) {
    console.error(error);
    return new Response("Error during reservations", { status: 500 });
  }
}
