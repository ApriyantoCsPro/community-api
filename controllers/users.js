"use strict";

const User = require("../models/User");
const Subscriber = require("../models/Follow")
const { Op } = require('Sequelize')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");


// CRUD users REGISTER and LOGIN

exports.createUsers = async function (req, res) {
  try {
    const { first_name, last_name, email, password, confPassword, role } = req.body;
    const token = (Math.random() + 1).toString(36).substring(7);
    const user = await User.findAll({ where: { email } })

    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"})
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    

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

    await User.create({ first_name, last_name, email, password: hashPassword, role, token })

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

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    })

    const match = await bcrypt.compare(req.body.password, user.password)
    if(!match) return res.status(400).json({msg: "Wrong Password"})

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
    delete findUser.deleted;

    if (!findUser || findUser.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }

    let total_followers = await Follow.count({
      where: {followee_id: findUser.id}
    })

    findUser.total_followers = total_followers


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

exports.updateUsers = async function (req, res) {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, email, password } = req.body;

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

    if (email) {
      const emailDB = await User.findAll({where: {email}}) 

      if (!emailDB || emailDB.length > 1) {
        return res.status(400).send({
          status: false,
          message: "Email Sudah Ada Dalam Data",
        });
      }
    }

    // TODO encrypt password
    if (password) {
      // encrypt
      // save to database
    }

    const oldData = JSON.parse(JSON.stringify(user))
    const payload = {first_name, last_name, email, password}


    // payload.first_name = req.body['first_name'] || oldData.first_name   /// EXAMPLE for Development
    Object.keys(payload).map(d => {
      payload[d] = req.body[d] || oldData[d]
    })

    await User.update(payload, {
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
