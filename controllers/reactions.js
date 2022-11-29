"use strict";

const Reaction = require("../models/Reaction")
const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const {Op} = require("Sequelize")

exports.createReactions = async function (req, res) {
  try {
    const { user_id, target_type, target_id, reaction_type } = req.body;
    let users = await User.findOne({
      where: {
        [Op.and]: [{id: user_id}, {deleted: null}]
      }
    })
    users = JSON.parse(JSON.stringify(users))

    if ( !users ) {
      return res.status(400).send({
        status: false,
        message: "user_id tidak ditemukan.",
      });
    }

    if (
        reaction_type !== "funny" &&
        reaction_type !== "sad" &&
        reaction_type !== "love" &&
        reaction_type !== "surprised"
    ){
        return res.status(400).send({
            status: false,
            message: "Reaction tidak ada."
        })
    }

    let targetQuery = "";

    if (target_type === "post") {
      // targetQuery = `SELECT * FROM posts WHERE id = ${target_id} AND deleted is null`;
      targetQuery = Post.findOne({where: { [Op.and]: [{id: target_id}, {deleted: null}] }})
    } else if (target_type === "comment") {
      // targetQuery = `SELECT * FROM comments WHERE id = ${target_id} AND deleted is null`;
      targetQuery = Comment.findOne({where: { [Op.and]: [{id: target_id}, {deleted: null}] }})
    } else
      return res.status(400).send({
        status: false,
        message: "Hanya untuk post dan comment!",
      });

    const targetData = await targetQuery;

    if (!targetData) {
      return res.status(400).send({
        status: false,
        message: `${target_type} tidak ditemukan!`,
      });
    }

    // const reactInDB = await query(
    //   `SELECT * FROM reactions WHERE user_id = ${user_id} AND target_type = '${target_type}' AND target_id = ${target_id}`
    // );

    const reactInDB = await Reaction.findAll({
      where: {
        [Op.and]: [{user_id}, {target_type}, {target_id}]
      }
    })

    if (reactInDB.length >= 1) {
      await Reaction.destroy({
        where: {
          [Op.and]: [{user_id}, {target_type}, {target_id}]
        }
      })
    } else {
      await Reaction.create({user_id, target_type, target_id, reaction_type})
    }

    res.send({
      status: true,
      message: "Berhasil mengupdate react",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
