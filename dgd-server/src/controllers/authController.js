const https = require('https');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const jwtConfig = require('../config/jwt');
const wechatConfig = require('../config/wechat');
const response = require('../utils/response');

const generateMockOpenid = () => {
  return `mock_openid_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};

const code2Session = (code) => {
  return new Promise((resolve, reject) => {
    const url = `${wechatConfig.loginUrl}?appid=${wechatConfig.appId}&secret=${wechatConfig.secret}&js_code=${code}&grant_type=authorization_code`;
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(new Error('微信接口返回格式错误'));
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

exports.login = async (req, res, next) => {
  try {
    const { code, userInfo } = req.body;
    if (!code) {
      return res.status(400).json(response.error(400, '缺少 code 参数'));
    }

    let openid;
    let sessionKey = '';

    const useMock =
      !wechatConfig.appId ||
      !wechatConfig.secret ||
      wechatConfig.appId === 'your_wechat_appid' ||
      wechatConfig.secret === 'your_wechat_secret';
    if (useMock) {
      openid = generateMockOpenid();
    } else {
      const wxRes = await code2Session(code);
      if (wxRes.errcode) {
        return res.status(400).json(response.error(wxRes.errcode, wxRes.errmsg || '微信登录失败'));
      }
      if (!wxRes.openid) {
        return res.status(400).json(response.error(400, '微信登录失败，未获取到 openid'));
      }
      openid = wxRes.openid;
      sessionKey = wxRes.session_key || '';
    }

    const [existingUsers] = await pool.query('SELECT * FROM users WHERE openid = ?', [openid]);

    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
      if (userInfo) {
        const nickname = userInfo.nickName || userInfo.nickname || user.nickname;
        const avatar = userInfo.avatarUrl || userInfo.avatar || user.avatar;
        await pool.query('UPDATE users SET nickname = ?, avatar = ? WHERE id = ?', [
          nickname,
          avatar,
          user.id,
        ]);
        user.nickname = nickname;
        user.avatar = avatar;
      }
    } else {
      const defaultLevelId = 1;
      const nickname = userInfo ? userInfo.nickName || userInfo.nickname || null : null;
      const avatar = userInfo ? userInfo.avatarUrl || userInfo.avatar || null : null;
      const [result] = await pool.query(
        'INSERT INTO users (openid, nickname, avatar, level_id, status) VALUES (?, ?, ?, ?, ?)',
        [openid, nickname, avatar, defaultLevelId, 'active']
      );
      const [newUsers] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUsers[0];
    }

    const [[level]] = await pool.query('SELECT id, name FROM levels WHERE id = ?', [user.level_id || 1]);

    const token = jwt.sign(
      {
        user_id: user.id,
        openid: user.openid,
        level_id: user.level_id || 1,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.json(
      response.success({
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          level_id: user.level_id || 1,
          level_name: level ? level.name : '普通用户',
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    res.json(response.success({ msg: 'not implemented' }));
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.json(response.success({ msg: 'not implemented' }));
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    res.json(response.success({ msg: 'not implemented' }));
  } catch (err) {
    next(err);
  }
};

exports.wechatLogin = exports.login;
