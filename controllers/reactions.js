"use strict";

const Reaction = require("../models/Reaction")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const {Op} = require("Sequelize")

exports.createReactions = async function (req, res) {
  try {
    const { target_type, target_id, reaction_type } = req.body;

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
      targetQuery = Post.findOne({where: { [Op.and]: [{id: target_id}, {deleted: null}] }})
    } else if (target_type === "comment") {
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

    const reactInDB = await Reaction.findAll({
      where: {
        [Op.and]: [{user_id: req.id}, {target_type}, {target_id}]
      }
    })

    if (reactInDB.length >= 1) {
      await Reaction.destroy({
        where: {
          [Op.and]: [{user_id: req.id}, {target_type}, {target_id}]
        }
      })
    } else {
      await Reaction.create({user_id: req.id, target_type, target_id, reaction_type})
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
