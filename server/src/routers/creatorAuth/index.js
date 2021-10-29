// const express = require('express');
// const router = express.Router();
// const argon2 = require('argon2');
// const Creator = require('../../models/creatorSchema');

// const { validUser } = require('../../middleware/creator');

// // 새 사용자를 만드는 로직(회원가입)
// router.post('/', async (req, res) => {
//   // 입력된 정보가 다 안들어왔으면 에러를 보내준다.
//   if (
//     // !req.body.id ||
//     !req.body.email ||
//     !req.body.username ||
//     !req.body.password
//     // !req.body.password ||
//     // !req.body.creatorGroup ||
//     // !req.body.userGroup
//   )
//     return res.status(400).send({
//       message: 'infos are required',
//     });

//   try {
//     // console.log(req.body.username);
//     const existingUser = await Creator.findOne({
//       creatorUsername: req.body.username,
//     });
//     // console.log(existingUser);
//     // 만약 username이 이미 있다면 username이미 있다는 메세지를 보낸다.
//     if (existingUser)
//       return res.status(403).send({
//         message: 'username already exists',
//       });

//     // 정보 검증이 끝났으므로 user DB에 입력받은 정보를 저장한다.
//     const creator = new Creator({
//       // !req.body.id ||
//       // !req.body.email ||
//       // !req.body.username ||
//       // !req.body.password ||
//       // !req.body.creatorGroup ||
//       // !req.body.userGroup
//       creatorUsername: req.body.username,
//       password: req.body.password,
//       // id: req.body.id,
//       creatorEmail: req.body.email,
//       // creatorGroup: req.body.creatorGroup,
//       // userGroup: req.body.userGroup,
//     });
//     await creator.save();

//     // 회원가입하고 바로 로그인이 되도록 해주기 위해
//     //  session에 userID를 싣어준다. (세션에 userID 싣는다 === 로그인)
//     // req.session.userID = user.id;

//     // 생성된 user정보를 보낸다 (password는 userSchema 생성 때 작성한 toJSON가 실행되면서 사라져서 username과 location만 전달된다.)
//     return res.send({
//       creator: creator,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // 로그인 로직
// router.post('/login', async (req, res) => {
//   // 입력 검증 후 입력 안된게 있으면 에러를 보낸다.
//   if (!req.body.username || !req.body.password) return res.sendStatus(400);

//   try {
//     // username 이 DB에 있는지 찾는다.
//     const creator = await Creator.findOne({
//       creatorUsername: req.body.username,
//     });

//     // username이 DB에 없으므로 에러를 보낸다.
//     // 여기서 username이 없고 password를 틀리지 않은 걸 알기 때문에 없는 username입니다라는 메세지를 보내줘도 되지만
//     // 이 로직으로 username이 없다는 정보를 보내고, 아래 로직으로 username은 있는데 password가 틀렸다는 정보를 보내면
//     // username이 존재한다는 정보를 주기 때문에 attacker에게 가게되면 보안상 안좋으므로 일부러 정보를 숨긴다.
//     if (!creator)
//       return res.status(403).send({
//         message: 'username or password is wrong',
//       });

//     // 다음 user는 있는데 password가 다르면 에러를 보낸다.
//     if (!(await creator.comparePassword(req.body.password)))
//       return res.status(403).send({
//         message: 'password is wrong',
//       });

//     // 모든 검증과정이 끝났으면 로그인을 한다. (세션에 userID 싣는다 === 로그인)
//     req.session.creatorUsername = creator.creatorUsername;
//     return res.send({
//       creator: creator,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // user정보를 가져오는 API
// // validUser라는 미들웨어를 달아서 아무나 이 API를 사용하지 못하고 로그인한 사용자만 사용할 수 있도록 제한한다.
// router.get('/', validUser, async (req, res) => {
//   try {
//     res.send({
//       creator: req.creator,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // 로그아웃
// // 로그인이 session에 userId를 싣는 걸 의미하므로
// // 로그아웃은 반대로 세션에 userId를 지우는 것을 의미
// router.delete('/', validUser, async (req, res) => {
//   try {
//     req.session = null;
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // router.put('/checkup', validUser, async (req, res) => {
// //   const slangId = req.body.slangId;
// //   const userId = req.user._id;
// //   const correctAnswerIds = req.user.correctAnswerIds;
// //   try {
// //     await User.updateOne(
// //       { _id: userId },
// //       { correctAnswerIds: [...correctAnswerIds, slangId] }
// //     );
// //   } catch (err) {
// //     console.log(err);
// //     return res.sendStatus(500);
// //   }
// // });

// module.exports = router;
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const Creator = require('../../models/creatorSchema');

const { validUser } = require('../../middleware/creator');

// 새 사용자를 만드는 로직(회원가입)
router.post('/', async (req, res) => {
  // 입력된 정보가 다 안들어왔으면 에러를 보내준다.
  if (
    // !req.body.id ||
    !req.body.email ||
    !req.body.username ||
    !req.body.password
    // !req.body.password ||
    // !req.body.creatorGroup ||
    // !req.body.userGroup
  )
    return res.status(400).send({
      message: 'infos are required',
    });

  try {
    // console.log(req.body.username);
    const existingUser = await Creator.findOne({
      creatorUsername: req.body.username,
    });
    // console.log(existingUser);
    // 만약 username이 이미 있다면 username이미 있다는 메세지를 보낸다.
    if (existingUser)
      return res.status(403).send({
        message: 'username already exists',
      });

    // 정보 검증이 끝났으므로 user DB에 입력받은 정보를 저장한다.
    const creator = new Creator({
      // !req.body.id ||
      // !req.body.email ||
      // !req.body.username ||
      // !req.body.password ||
      // !req.body.creatorGroup ||
      // !req.body.userGroup
      creatorUsername: req.body.username,
      password: req.body.password,
      // id: req.body.id,
      creatorEmail: req.body.email,
      // creatorGroup: req.body.creatorGroup,
      // userGroup: req.body.userGroup,
    });
    await creator.save();

    // 회원가입하고 바로 로그인이 되도록 해주기 위해
    //  session에 userID를 싣어준다. (세션에 userID 싣는다 === 로그인)
    // req.session.userID = user.id;

    // 생성된 user정보를 보낸다 (password는 userSchema 생성 때 작성한 toJSON가 실행되면서 사라져서 username과 location만 전달된다.)
    return res.send({
      creator: creator,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// 로그인 로직
router.post('/login', async (req, res) => {
  // 입력 검증 후 입력 안된게 있으면 에러를 보낸다.
  if (!req.body.username || !req.body.password) return res.sendStatus(400);

  try {
    // username 이 DB에 있는지 찾는다.
    const creator = await Creator.findOne({
      creatorUsername: req.body.username,
    });

    // username이 DB에 없으므로 에러를 보낸다.
    // 여기서 username이 없고 password를 틀리지 않은 걸 알기 때문에 없는 username입니다라는 메세지를 보내줘도 되지만
    // 이 로직으로 username이 없다는 정보를 보내고, 아래 로직으로 username은 있는데 password가 틀렸다는 정보를 보내면
    // username이 존재한다는 정보를 주기 때문에 attacker에게 가게되면 보안상 안좋으므로 일부러 정보를 숨긴다.
    if (!creator)
      return res.status(403).send({
        message: 'username or password is wrong',
      });

    // 다음 user는 있는데 password가 다르면 에러를 보낸다.
    if (!(await creator.comparePassword(req.body.password)))
      return res.status(403).send({
        message: 'password is wrong',
      });

    // 모든 검증과정이 끝났으면 로그인을 한다. (세션에 userID 싣는다 === 로그인)
    req.session.creatorUsername = creator.creatorUsername;
    return res.send({
      creator: creator,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// user정보를 가져오는 API
// validUser라는 미들웨어를 달아서 아무나 이 API를 사용하지 못하고 로그인한 사용자만 사용할 수 있도록 제한한다.
router.get('/', validUser, async (req, res) => {
  try {
    res.send({
      creator: req.creator,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// 로그아웃
// 로그인이 session에 userId를 싣는 걸 의미하므로
// 로그아웃은 반대로 세션에 userId를 지우는 것을 의미
router.delete('/', validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// router.put('/checkup', validUser, async (req, res) => {
//   const slangId = req.body.slangId;
//   const userId = req.user._id;
//   const correctAnswerIds = req.user.correctAnswerIds;
//   try {
//     await User.updateOne(
//       { _id: userId },
//       { correctAnswerIds: [...correctAnswerIds, slangId] }
//     );
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(500);
//   }
// });

module.exports = router;
