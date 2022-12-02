"use strict";
// const {Like, User, Post, Comment} = require("../models")
// TODO Next Refactoring
const Like = require("../models/Like")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const {Op} = require("Sequelize")

exports.createLikes = async function (req, res) {
  try {
    const { target_type, target_id } = req.body;
    const email = req.email
    let targetQuery = "";

    if (target_type === "post") {
      targetQuery = Post.findOne({where: { [Op.and]: [{id: target_id}, {deleted: null}] }})
    } else if (target_type === "comment") {
      targetQuery = Comment.findOne({where: { [Op.and]: [{id: target_id}, {deleted: null}] }})
    } else
      return res.status(400).send({
        status: false,
        message: "Hanya untuk post dan comment!",
      });

    const targetData = await targetQuery

    if (!targetData || targetData.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${target_type} tidak ditemukan!`,
      });
    }

    const likeiInDB = await Like.findAll({
      where: {
        [Op.and]: [{user_email: email}, {target_type}, {target_id}]
      }
    })

    if (likeiInDB.length >= 1) {
      await Like.destroy({
        where: {
          [Op.and]: [{user_email: email}, {target_type}, {target_id}]
        }
      })
    } else {
      await Like.create({user_email: email, target_type, target_id})
    }
    
    res.send({
      status: true,
      message: "Berhasil mengupdate like",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
