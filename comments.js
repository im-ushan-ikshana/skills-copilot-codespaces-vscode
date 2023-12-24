// Create web server application that responds to requests to the /comments endpoint
// and returns the full list of comments from the database.
// This endpoint should accept the following query string parameters to filter comments:
// - page - The page of comments to return. Default: 1.
// - limit - The number of comments to return. Default: 20.
// - sort - The field to sort comments by. Default: created_at.
// - direction - The direction to sort comments by. Default: desc.

const express = require("express");
const router = express.Router();
const db = require("../db");
const { BadRequestError } = require("../expressError");

// GET /comments
// Returns the full list of comments from the database
// Accepts the following query string parameters to filter comments:
// - page - The page of comments to return. Default: 1.
// - limit - The number of comments to return. Default: 20.
// - sort - The field to sort comments by. Default: created_at.
// - direction - The direction to sort comments by. Default: desc.
router.get("/", async function (req, res, next) {
  const { page = 1, limit = 20, sort = "created_at", direction = "desc" } =
    req.query;

  const validSorts = ["created_at", "votes"];
  const validDirections = ["asc", "desc"];
  if (!validSorts.includes(sort)) {
    throw new BadRequestError(`Invalid sort: ${sort}`);
  }
  if (!validDirections.includes(direction)) {
    throw new BadRequestError(`Invalid direction: ${direction}`);
  }
  const offset = (page - 1) * limit;
  const comments = await db.query(
    `SELECT id, username, body, votes, created_at
    FROM comments
    ORDER BY ${sort} ${direction}
    LIMIT $1
    OFFSET $2`,
    [limit, offset]
  );
  return res.json({ comments: comments.rows });
});

module.exports = router;



