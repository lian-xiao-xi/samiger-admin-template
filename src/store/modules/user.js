import { getSalt, login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { sha256 } from 'js-sha256';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 获取登陆所需的盐
      getSalt(username).then(response => {
        const newPassword = sha256.hmac(response.salt, password).toUpperCase();
        const hmacPassword = sha256.hmac(response.token, newPassword + username);
        return login({ username: username.trim(), password: hmacPassword });
      }).then(response => {
        if (response.code) {
          reject(response);
        } else {
          commit('SET_TOKEN', response.yioksToken);
          setToken(response.yioksToken);
          resolve();
        }
      }).catch(error => {
        reject(error);
      });
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (response.code === undefined) {
          if (!response) {
            reject('用户角色信息获取失败！请稍后重新登陆！');
          }
          if (response.length <= 0) reject('用户无角色！请稍后重新登陆！');

          const couldLoginRoles = ['admin', 'tmk'];
          
          const myRoles = response.roles.filter(role => couldLoginRoles.includes(role));
          if (myRoles.length <= 0) {
            reject('暂无登录权限！');
          }

          commit('SET_ROLES', myRoles);
          commit('SET_NAME', response.loginName);
          commit('SET_AVATAR', response.headImgUrl);
          resolve(myRoles);
        } else {
          reject(response);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', []);
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

