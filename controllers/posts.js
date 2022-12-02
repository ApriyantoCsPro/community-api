"use strict";

const Post = require("../models/Post")
const { Op } = require('Sequelize');
const User = require("../models/User");


//CRUD posting/status content users

exports.createPosts = async function (req, res) {
  try {
    const { content } = req.body;
    const email = req.email
        
    if (!email || email.length === 0) {
      return res.status(400).send({
        status: false,
        message: "user tidak ditemukan.",
      });
    }

    await Post.create({user_email: email, content})

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

exports.posts = async function (req, res) {
  try {
    let posts = await Post.findAll({where: {deleted: null}})
    posts = JSON.parse(JSON.stringify(posts))

    posts = posts.map((posts) => {
      delete posts.deleted;
      return posts;
    });

    res.send({
      status: true,
      message: "Semua Posts",
      data: posts,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.findPosts = async function (req, res) {
  let post_id = req.params.post_id;
  try {
    let postDB = await Post.findOne({
      where: {
        [Op.and]: [{ id: post_id }, { deleted: null }]
      }})
    postDB = JSON.parse(JSON.stringify(postDB))
    

    if (!postDB || postDB.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }

    let userDB = await User.findOne({where: {id: `${postDB.id}`}})
    userDB = JSON.parse(JSON.stringify(userDB))


    postDB.user_details = {
      fullName: userDB.first_name + ' ' + userDB.last_name,
      email: userDB.email
    }

    res.send({
      status: true,
      message: "Data Status",
      data: postDB
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.updatePosts = async function (req, res) {
  try {
    const { post_id } = req.params;
    const { content } = req.body;

    const postDB = await Post.findOne({
      where : {
      [Op.and]: [{id: post_id}, {deleted: null}]
    }})

    if (!postDB) {
      return res.status(404).send({
        status: false,
        message: "Posts tidak ditemukan.",
      });
    }

    await Post.update({content}, {where: {id: post_id}})

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

exports.deletePosts = async function (req, res) {
  try {
    const { user_id } = req.params;
    await Post.update({deleted: `${new Date}` }, { where: {id: user_id}})

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
