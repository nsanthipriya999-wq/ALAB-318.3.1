import express from 'express'
const router = express.Router()

import posts from "../data/posts.js";
import comments from "../data/comments.js";

import users from '../data/users.js'
import error from '../utilities/error.js'

//------------------GET/api/users-------------------
router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "/api/users/:id/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "/api/users/:id/comments",
        rel: "comments",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  //---------Post /api/users-------------------
  .post((req, res, next) => {
    if (!(req.body.name && req.body.username && req.body.email)) {
        return next(error(400, "Insufficient Data"));
    }
      if (users.find((u) => u.username == req.body.username)) {
        return next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      }
      
      users.push(user);
      res.status(201).json(user);
    
  });
//------GET/api/users/:id----------------------
router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/api/users/${req.params.id}`,
        rel: "",
        type: "GET",
      },
      {
        href: `/api/users/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/api/users/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (user) res.json({ user, links });
    else return next(error(404,"User not found"));
  })

  //----PATCH/api/users/:id--------------
  .patch((req, res, next) => {

    const user=users.find((u,i)=>u.id===Number(req.params.id));
    const i=users.findIndex(u=>u.id===Number(req.params.id));
    if(!user)
    {
      return next(error(404,"user not found"));
    }

    const allowed=["name","username","email"];
       for (const key of allowed) {
          if (req.body[key]){
          users[i][key] = req.body[key];
        }
        
      }
      res.json(user);
    })

    
  //---------------------------delete-----------------------

  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id ===Number( req.params.id)) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

  //------------------/:id/posts--------------------
  router.route("/:id/posts").get((req, res)=> {
    let x = posts.filter(p => 
      p.userId === Number(req.params.id)
    )
    res.json(x)
  }) 


  //----GET/api/users/:id/comments---------------------------
  router.get("/:id/comments",(req,res)=>{
    const userId=Number(req.params.id);
    let results=comments.filter(c=>c.userId===userId);
    if(req.query.postId)
    {
      results=results.filter(c=>c.postId===Number(req.query.postId));
    }
    res.json(results);
  });
export default router