import express from "express";
const router = express.Router();

import posts from "../data/posts.js";
import comments from "../data/comments.js";
import error from "../utilities/error.js";

//
// GET /api/posts
//
router.route("/").get((req, res) => {
  const { userId } = req.query;

  const links = [
    {
      href: "/api/posts/:id",
      rel: "post",
      type: "GET",
    },
  ];

  if (userId) {
    return res.json(
      posts.filter(p => p.userId === Number(userId))
    );
  }

  res.json({ posts, links });
});

//
// POST /api/posts
//
router.route("/").post((req, res, next) => {
  if (!req.body.userId || !req.body.title || !req.body.content) {
    return next(error(400, "Insufficient Data"));
  }

  const post = {
    id:
      posts.length > 0
        ? Math.max(...posts.map(p => p.id)) + 1
        : 1,
    userId: Number(req.body.userId),
    title: req.body.title,
    content: req.body.content,
  };

  posts.push(post);

  res.status(201).json(post);
});

//
// GET /api/posts/:id
//
router.route("/:id").get((req, res, next) => {
  const post = posts.find(
    p => p.id === Number(req.params.id)
  );

  if (!post) {
    return next(error(404, "Post not found"));
  }

  const links = [
    {
      href: `/api/posts/${post.id}`,
      rel: "self",
      type: "GET",
    },
    {
      href: `/api/posts/${post.id}`,
      rel: "update",
      type: "PATCH",
    },
    {
      href: `/api/posts/${post.id}`,
      rel: "delete",
      type: "DELETE",
    },
    {
      href: `/api/posts/${post.id}/comments`,
      rel: "comments",
      type: "GET",
    },
  ];

  res.json({ post, links });
});

//
// PATCH /api/posts/:id
//
router.route("/:id").patch((req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id === Number(req.params.id)) {
      for (const key in req.body) {
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (!post) {
    return next(error(404, "Post not found"));
  }

  res.json(post);
});

//
// DELETE /api/posts/:id
//
router.route("/:id").delete((req, res, next) => {
  const index = posts.findIndex(
    p => p.id === Number(req.params.id)
  );

  if (index === -1) {
    return next(error(404, "Post not found"));
  }

  const deleted = posts.splice(index, 1)[0];

  res.json(deleted);
});

//
// GET /api/posts/:id/comments
// GET /api/posts/:id/comments?userId=1
//
router.get("/:id/comments", (req, res) => {
  const postId = Number(req.params.id);

  let results = comments.filter(
    c => c.postId === postId
  );

  if (req.query.userId) {
    results = results.filter(
      c => c.userId === Number(req.query.userId)
    );
  }

  res.json(results);
});

export default router;