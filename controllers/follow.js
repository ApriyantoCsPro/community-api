"use strict";

const Follow = require("../models/Follow")
const User = require("../models/User")
const {Op} = require("Sequelize");
 
exports.createFollow = async function (req, res) {
  try {
    const { followee_id } = req.body;
    const user = await User.findOne({
      where: {
        [Op.and]: [{id: followee_id}, {deleted: null}]
      }
    })

    if (!user || user.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${followee_id} tidak ditemukan!`,
      });
    }

    if(user.id === req.id) {
      return res.status(400).send({
        status: false,
        message: "Aksi tidak dapat dilakukan!",
      });
    }

    const follow = await Follow.findAll({
      where: {
        [Op.and]: [{follower_id: req.id}, {followee_id} ]
      }
    })

    if (follow.length >= 1) {
      await Follow.destroy({
        where: {
        [Op.and]: [{follower_id: req.id}, {followee_id}]
      }})
    } else {
      await Follow.create({follower_id: req.id, followee_id})
    }

    res.send({
      status: true,
      message: "Berhasil mengupdate follow",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
