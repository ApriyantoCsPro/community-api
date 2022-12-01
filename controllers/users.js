"use strict";

const User = require("../models/User");
const Subscriber = require("../models/Subscriber")
const { Op } = require('Sequelize')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// TODO
// - Buat field baru di column register untuk role
// - Buat field TOKEN
// - role [user | admin]
// - Buat API untuk get all user dimana hanya yang memiliki role 'admin' yang bisa akses

// CRUD users REGISTER and LOGIN

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    })

    const userId = user.id
    const name = user.first_name + user.last_name
    const email = user.email

    const accessToken = jwt.sign({userId, name, email}, `${process.env.ACCESS_TOKEN_SECRET}`)
    const refreshToken = jwt.sign({userId, name, email}, `${process.env.REFRESH_TOKEN_SECRET}`)

    await User.update({access_token: accessToken}, {
      where: { id: userId }
    })

    await User.update({refresh_token: refreshToken}, {
      where: { id: userId }
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken })
  } catch (err) {
    console.error("Error", err)
    res.status(404).json({msg: "Email not found"})
  }
}


exports.users = async function (req, res) {
  try {
    let users = await User.findAll({where: {deleted: null}});

    users = users.map((user) => {
      user = JSON.parse(JSON.stringify(user))
      delete user.deleted;
      return user;
    });

    res.send({
      status: true,
      message: "Semua Data",
      data: users,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.findUsers = async function (req, res) {
  const user_id = req.params.user_id;
  try {
    let findUser = await User.findOne({
      where: {
        [Op.and]: [{ id: user_id }, { deleted: null }]
      }})
    findUser = JSON.parse(JSON.stringify(findUser))

    if (!findUser || findUser.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }
    
    // const subs = await query(
    //   `select follower_id, count(follower_id) as followers from subscribers where follower_id = '${findUser[0].id}' group by follower_id`
    // )

    let subs = await Subscriber.findAll({
      where: {follower_id: findUser.id}
    })
    subs = JSON.parse(JSON.stringify(subs))

    // console.log(subs.follower_id)
    findUser.total_followers = subs.length > 0 ? subs.followers : 0;

    findUser.followers_details = {
      email: findUser.email,
    }


    res.send({
      status: true,
      message: "Data User",
      data: findUser
    });
  } catch (error)  {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.createUsers = async function (req, res) {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const token = (Math.random() + 1).toString(36).substring(7);
    const user = await User.findAll({ where: { email } })
    

    if (!user || user.length >= 1) {
      return res.status(400).send({
        status: false,
        message: "Email Sudah Digunakan!",
      });
    }

    if (password.length < 5) {
      return res.status(400).send({
        status: false,
        message: "Password tidak boleh kurang dari 5 karakter",
      });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({
        status: false,
        message: "Alamat email tidak valid!",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).send({
        status: false,
        message: "Role Tidak ditemukan!",
      });
    }

    await User.create({ first_name, last_name, email, password, role, token })

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

exports.updateUsers = async function (req, res) {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, email, password } = req.body;

    const emailDB = await User.findAll({where: {email}}) 
    const user = await User.findOne(
      {where: {
        [Op.and]: [{ id: user_id }, { deleted: null }]
      }})

    if (!user || user.length === 0) {
      return res.status(400).send({
        status: false,
        message: "User tidak ditemukan.",
      });
    }

    if (!emailDB || emailDB.length > 1) {
      return res.status(400).send({
        status: false,
        message: "Email Sudah Ada Dalam Data",
      });
    }

    await User.update({first_name, last_name, email, password}, {
      where: {id: user_id}
    })

    res.send({
      status: true,
      message: "Update success",
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.logout = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204) //204 is no content
    const user = await User.findAll({
      where:{
        refresh_token: refreshToken
      }
    })
    if(!user[0]) return res.sendStatus(204)
    const userId = user[0].id    //ambil id user dari database
    await User.update({refresh_token: null}, {
      where: {
        id: userId
      }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
   } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
 }
  
exports.deleteUsers = async function (req, res) {
  try {
    const { user_id } = req.params;
    await User.update({deleted: `${new Date}` }, { where: {id: user_id}})

    res.send({
      status: true,
      message: "Data berhasil dihapus!",
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

// ------------ // -------------// --------- // --------- //
