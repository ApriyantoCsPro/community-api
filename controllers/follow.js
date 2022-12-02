"use strict";

const Follow = require("../models/Follow")
const User = require("../models/User")
const {Op} = require("Sequelize");

exports.createFollow = async function (req, res) {
  try {
    const { target_user_id } = req.body;
    const user_email = req.email

    const user = await User.findOne({
      where: {
        [Op.and]: [{id: target_user_id}, {deleted: null}]
      }
    })

    if (!user || user.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${target_user_id} tidak ditemukan!`,
      });
    }

    const follow = await Follow.findAll({where: {id: target_user_id}})

    if (follow.length >= 1) {
      await Follow.destroy({where: {id: target_user_id}})
    } else {
      await Follow.create({user_email, target_user_id})
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
