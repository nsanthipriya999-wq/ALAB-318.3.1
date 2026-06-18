import express from 'express';
const router = express.Router();
import comments from '../data/comments.js';
import error from "../utilities/error.js";

//---------------------GET/comments---------------------------------
router
    .route("/")
    .get((req, res) => { 
        const {userId,postId}=req.query;
        let readComments=comments;
        if(userId)
        {
          readComments=readComments.filter(c=>c.userId===Number(userId));
        
        }  
         if (postId)
         {
            readComments=readComments.filter(c=>c.postId===Number(postId));
         }
         res.json(readComments);

    })
//---------------------POST /comments---------------------
    .post((req, res,next) => {
       const{userId,postId,body}=req.body;
       if(!userId||!postId||!body){
        return next(error(400,"Data Insufficient"));

       }
//----------------new comment--------------------------
        const c = {
            id: comments.length
                ? comments[comments.length - 1].id + 1 : 1,
            userId: Number(req.body.userId),
            postId: Number(req.body.postId),
            body: req.body.body
        }
        comments.push(c);
        res.status(201).json(c);
    });
//---------------GET/comments/:id-----------------------
router
    .route("/:id")
    .get((req, res, next) => {
        const x = comments.find(c => c.id === Number(req.params.id))


        if (!x) {
            return next(error(404, "comment not found"))
        }

       
      res.json(x);

        
    })
//-----Patch/comments/:id--------------------------------------------

   .patch((req, res, next) => {
        const x = comments.find((c,i) => {
            if(c.id === Number(req.params.id)){
                if(req.body.body){
                    comments[i].body=req.body.body
                }
                return true;
            }
        }
        );

        if (!x) {
            return next(error(404, "comment not found"))
        }

        
      res.json(x);

        
    })

    //---------------DELETE/comments/:id----------------
   .delete((req, res, next) => {
        const index = comments.findIndex(c => c.id === Number(req.params.id));
  

        if (index===-1) {
            return next(error(404, "comment not found"))
        }
        const deletedComment=comments.splice(index,1)[0];
        res.json(deletedComment);
        
    });


export default router