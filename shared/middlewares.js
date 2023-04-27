// // const tokenService from'./userServices')

// export default function (req, res, next) {
//   try {
//     const authorizationHeader = req.headers.authorization
//     // if (!authorizationHeader) throw 1
//     const accessToken = authorizationHeader.split(' ')[1]
//     // if (!accessToken) throw 2
//     const userData = tokenService.validateAccessToken(accessToken)
//     // if (!userData) throw
//     req.user = userData
//     next()
//   } catch (error) {
//     console.error(error)
//   }
// }
