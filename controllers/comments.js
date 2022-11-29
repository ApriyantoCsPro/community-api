"use strict";

const Comment = require("../models/Comment")
const User = require("../models/User")
const {Op} = require("Sequelize")

//CRUD posting/status content users

exports.createComments = async function (req, res) {
  try {
    const { user_id, post_id, comment } = req.body;
    const findUserId = await Comment.findOne({
      where: {
        [Op.and]: [{id: user_id}, {deleted: null}]
      }
    })

    const findPostId = await Comment.findOne({
      where: {
        [Op.and]: [{id: post_id}, {deleted: null}]
      }
    })

    if (!findUserId || !findPostId || findUserId.length === 0 || findPostId.length === 0) {
      return res.status(400).send({
        status: false,
        message: "user_id atau post_id tidak ditemukan.",
      });
    }

    await Comment.create({user_id, post_id, comment})

    res.send({
      status: true,
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.comments = async function (req, res) {
  try {
    let comments = await Comment.findAll({where: {deleted: null}})
    comments = JSON.parse(JSON.stringify(comments))

    comments.map((comment) => {
      delete comment.deleted;
      return comment;
    });

    res.send({
      status: true,
      message: "Semua comments",
      data: comments,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.findComments = async function (req, res) {
  const { comment_id } = req.params;
  try {
    let findCommentsId = await Comment.findOne({
      where: {
        [Op.and]: [{id: comment_id}, {deleted: null}]
      }})
    findCommentsId = JSON.parse(JSON.stringify(findCommentsId)) 
      
    if (!findCommentsId) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }
    delete findCommentsId.deleted;

    let user = await User.findOne({where: {id: findCommentsId.user_id}})
    user = JSON.parse(JSON.stringify(user))

    findCommentsId.user_details = {
      fullName: user.first_name + ' ' + user.last_name,
      email: user.email,
    }

    // findCommentsId[0].react_details = {
    //   // react: react[0].reaction_type
    // }

    res.send({
      status: true,
      message: "Data Status",
      data: findCommentsId,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.updateComments = async function (req, res) {
  try {
    const { comment_id } = req.params;
    const { comment } = req.body;

    const commentsInDB = await Comment.findOne({
      where: {
        [Op.and]: [{id: comment_id}, {deleted: null}]
      }})

    if (!commentsInDB || commentsInDB.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Comment tidak ditemukan.",
      });
    }

    await Comment.update({comment}, {where: {id: comment_id}})

    res.send({
      status: true,
      message: "Update success",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.deleteComments = async function (req, res) {
  try {
    const { comment_id } = req.params;
    await Comment.update({deleted: `${new Date}` }, { where: {id: comment_id}})

    res.send({
      status: true,
      message: "Data berhasil dihapus!",
    });
  } catch (error) {
    console.log("Program error");
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
