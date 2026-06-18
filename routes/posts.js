import express from 'express'
const router = express.Router();
import comments from '../data/comments.js';
import posts from '../data/posts.js';
import error from '../utilities/error.js';
//import users from '../data/users.js';

router
  .route("/")
  .get((req, res) => {

    const links = [
      {
        //href: "posts/:id",
        href: "/api/posts/:id",
        rel: "post",
        type: "GET",
      },
    ];
    //-----checking for userId--------------   
    if (req.query.userId) {
      let x = posts.filter(p => p.userId === Number(req.query.userId))
      res.json(x)

      //-------------------postId---------------------
    } else {
      res.json({ posts, links });
    }
  })
  //----------------POst/api/posts-------------------------
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.status(201).json(post);
    } else next(error(400, "Insufficient Data"));
  });
//--------GET/api/posts/:id--------------
router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id === Number(req.params.id));
    if (!post)
      return next(error(404, "Post not found"));
    const links = [
      {
        href: `api/posts/${req.params.id}`,
        rel: "READ",
        type: "GET",
      },
      {
        href: `api/posts/${req.params.id}`,
        rel: "UPDATE",
        type: "PATCH",
      },
      {
        href: `api/posts/${req.params.id}`,
        rel: "DELETE",
        type: "DELETE",
      },
      {
        href: `api/posts/${post.id}/comments`,
        rel: "comments",
        type: "Post",
      },
    ];

    res.json({ post, links });
  })
  //-------------PATCH /api/posts/:id------
  .patch((req, res, next) => {

    const i = posts.findIndex(p => p.id === Number(req.params.id));
    if (i === -1) {
      return next(error(404, "Post not found"));
    }

    for (const key in req.body) {
      posts[i][key] = req.body[key];
    }
    res.json(posts[i]);
  })
  //-------------DELETE/api/posts/:id-------
  .delete((req, res, next) => {
    const i = posts.findIndex(p => p.id === Number(req.params.id));
    if (i === -1) {
      return next(error(404, "Post not found"));
    }

       const deleted= posts.splice(i, 1);
        res.json(deleted[0]);
  });
//------------GET/api/posts/:id/comments-and GET/api/posts/:id/comments?userId=1------------
router.get("/:id/comments", (req, res) => {
  const posId = Number(req.params.id);
  let resComment = comments.filter(c => c.postId === posId);
  if (req.query.userId) {
    resComment = resComment.filter(c => c.userId === Number(req.query.userId));
  }
  res.json(resComment);
});
export default router