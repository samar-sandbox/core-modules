const fsPromise = require("node:fs/promises");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const port = 3000;
const USERS_FILE = "users.json";

const server = http.createServer(async (req, res) => {
  const { url, method, body } = req;

  req.on("error", (error) => {
    console.error(error);
    res.statusCode = 400;
    res.end();
  });

  res.on("error", (error) => {
    console.error(error);
  });

  let users = [];
  try {
    if (!fs.existsSync(USERS_FILE)) {
      await fsPromise.writeFile(USERS_FILE, JSON.stringify([]));
    } else {
      const result = await fsPromise.readFile(USERS_FILE, {
        encoding: "utf-8",
      });
      users = JSON.parse(result);
    }
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Could not read user data" }),
    );
    return;
  }

  if (method === "POST" && url === "/user") {
    /**
     * URL: POST /user
     * Adds a new user to your users stored in a JSON file
     * Ensure that the email of the new user doesn’t exist before
     */

    let data = "";

    req
      .on("data", (chunk) => {
        data += chunk;
      })
      .on("end", async () => {
        try {
          if (!data) {
            throw new Error("Invalid data");
          }

          const { email, name, age } = JSON.parse(data);

          if (!email) {
            throw new Error("Email is required");
          }

          if (users.some((user) => user.email === email)) {
            res.writeHead(409, { "content-type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                message: "Email already exists",
              }),
            );
            return;
          }

          const id =
            users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

          users.push({ id, email, name, age });

          await fsPromise.writeFile(USERS_FILE, JSON.stringify(users));

          res.writeHead(201, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "User added successfully",
            }),
          );
        } catch (error) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ success: false, message: error.message }));
        }
      });
  } else if (method === "PATCH" && url.startsWith("/user/")) {
    /**
     * URL: PATCH /user/id
     * Updates an existing user's name, age, or email by their ID
     * The user ID should be retrieved from the URL
     * Update the corresponding values in the JSON file
     */

    const id = parseInt(url.split("/")[2]);
    if (isNaN(id)) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid user ID" }));
      return;
    }

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "User ID not found" }));
      return;
    }

    let data = "";
    req
      .on("data", (chunk) => {
        data += chunk;
      })
      .on("end", async () => {
        try {
          if (!data) {
            throw new Error("Invalid data");
          }

          const { age, name, email } = JSON.parse(data);

          const currentUserData = users[userIndex];
          const newUserData = {
            id: currentUserData.id,
            age: age ?? currentUserData.age,
            name: name ?? currentUserData.name,
            email: email ?? currentUserData.email,
          };

          users.splice(userIndex, 1, newUserData);

          await fsPromise.writeFile(USERS_FILE, JSON.stringify(users));

          res.writeHead(200, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "User updated successfully",
            }),
          );
        } catch (error) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ success: false, message: error.message }));
        }
      });
  } else if (method === "DELETE" && url.startsWith("/user/")) {
    /**
     * URL: DELETE /user/id
     * Deletes a User by ID.
     * The user id should be retrieved from the URL
     * Delete the user from the file
     */

    const id = parseInt(url.split("/")[2]);
    if (isNaN(id)) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid user ID" }));
      return;
    }

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "User ID not found" }));
      return;
    }

    users.splice(userIndex, 1);

    try {
      await fsPromise.writeFile(USERS_FILE, JSON.stringify(users));
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(
        JSON.stringify({ success: false, message: "Failed to save changes" }),
      );
      return;
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
    );
  } else if (method === "GET" && url === "/user") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      }),
    );
  } else if (method === "GET" && url.startsWith("/user/")) {
    /**
     * GET /user/:id
     * Gets User by ID
     */
    const id = parseInt(url.split("/")[2]);
    if (isNaN(id)) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid user ID" }));
      return;
    }

    const user = users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "User not found" }));
      return;
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        message: "User retrieved successfully",
        data: user,
      }),
    );
  } else {
    res.statusCode = 404;
    res.end("Invalid route");
  }
});

server.listen(port, () => {
  console.log("Server running on port", port);
});
