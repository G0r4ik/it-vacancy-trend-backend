// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import nodemailer from 'nodemailer'
// import queries from './sql.js'
// import uuid from 'uuid'
// // const currentDate from'../helpers/getCurrentDate')
// // const url from'../shared/consts')
// // const userDtoFunction from'../dtos/user-dto')

// class UserService {
//   generateToken(payload) {
//     const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
//       expiresIn: '30s',
//     })
//     const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: '30d',
//     })
//     return { refreshToken, accessToken }
//   }

//   async saveToken(userId, refreshToken) {
//     const tokenData = await queries.getUserById(userId)
//     if (tokenData.length > 0) {
//       queries.updateRefreshToken(refreshToken)
//     } else {
//       queries.createAuth(userId, refreshToken)
//     }
//   }

//   sendMessage(email, link) {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       auth: {
//         user: 'eforfora@gmail.com',
//         pass: 'tubzteysoybrjuki',
//       },
//     })
//     transporter.sendMail({
//       to: email,
//       text: `Your link: ${link}`,
//     })
//   }

//    registrationUser(email, password) {
//     const hasUser = await queries.getUserByEmail(email)
//     if (hasUser.length > 0) {
//       throw new Error(`Пользователь с почтой ${email} существует`)
//     }
//     const hashPassword = await bcrypt.hash(password, 3)
//     const activationLink = uuid.v4()
//     const user = await queries.createUser(
//       email,
//       hashPassword,
//       currentDate(),
//       activationLink
//     )
//     const userDto = userDtoFunction(user)
//     const tokens = this.generateToken({ ...userDto })
//     const activateUrl = `${url.server}/activateAccount?link=${activationLink}`
//     this.sendMessage(email, activateUrl)
//     this.saveToken(userDto.userId, tokens.refreshToken)
//     return { user: userDto, ...tokens }
//   }

//   async activate(activationLink) {
//     const user = await queries.getUserByActivationLink(activationLink)

//     if (user.length > 0)
//       throw 'Пользователя не существует или ссылка не активна'
//     await queries.changeUsersStatus(activationLink)
//   }

//   async login(email, password) {
//     const user = await queries.getUserByEmail(email)
//     if (!user) throw 'Пользователь не был найден'

//     const hashPassword = await bcrypt.compare(password, user.user_password)
//     if (!hashPassword) throw 'Неправильный пароль'

//     const userDto = userDtoFunction(user)
//     const tokens = this.generateToken({ ...userDto })
//     await this.saveToken(userDto.userId, tokens.refreshToken)
//     return { ...tokens, user: userDto }
//   }

//   async logout(refreshToken) {
//     queries.deleteRefreshToken(refreshToken)
//   }

//   validateAccessToken(token) {
//     try {
//       const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
//       return userData
//     } catch {
//       return null
//     }
//   }

//   validateRefreshToken(token) {
//     try {
//       const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
//       return userData
//     } catch {
//       return null
//     }
//   }

//   async refreshToken(refreshToken) {
//     if (!refreshToken) throw 'Некоректно'
//     const userData = await this.validateRefreshToken(refreshToken)
//     const tokenFromDatabase = await queries.getTokenByToken(refreshToken)
//     if (!userData || !tokenFromDatabase) throw 'Ошибка при авторизации'

//     const user = await queries.getUserByEmail(userData.user_email)
//     const userDto = userDtoFunction(user)
//     const tokens = this.generateToken({ ...userDto })
//     await this.saveToken(userDto.userId, tokens.refreshToken)
//     return { ...tokens, user: userDto }
//   }
// }

// export default new UserService()
