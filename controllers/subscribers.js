"use strict";

const Subscriber = require("../models/Subscriber")
const User = require("../models/User")
const {Op} = require("Sequelize")

exports.createSubscribes = async function (req, res) {
  try {
    const { followee_id, follower_id } = req.body;

    const followee = await User.findOne({
      where: {
        [Op.and]: [{id: followee_id}, {deleted: null}]
      }
    })

    const follower = await User.findOne({
      where: {
        [Op.and]: [{id: follower_id}, {deleted: null}]
      }
    })

    if (!followee || followee.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${followee_id} tidak ditemukan!`,
      });
    }

    if (!follower || follower.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${follower_id} tidak ditemukan!`,
      });
    }

    const subscriber = await Subscriber.findAll({
      where: {
        [Op.and]: [{followee_id}, {follower_id}]
      }
    })

    if (subscriber.length >= 1) {
      await Subscriber.destroy({
        where: {
          [Op.and]: [{followee_id}, {follower_id}]
        }
      })
    } else {
      await Subscriber.create({followee_id, follower_id})
    }

    res.send({
      status: true,
      message: "Berhasil mengupdate subscriber",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
