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
      getInfo().then(response => {
        if (!response) {
          reject('用户角色信息获取失败！请稍后重新登陆！');
        }
        /**
         * 后台返回数据格式：
         * {
          roles: [
            {code: 'system', name: '系统管理员'},
            {code: 'admin', name: '超级管理员'},
          ],
          user: {loginName: '张三', headImgUrl: 'url'}
        }
         */
        
        if (response.code === undefined) {
          // 可以登录的有效角色，视项目实际情况而定
          const couldLoginRoles = ['system', 'admin', 'tmk'];
          
          const myRoles = response.roles.reduce((acc, cur) => {
            if(couldLoginRoles.includes(cur.code)) {
              acc.push(cur.code)
            }
            return acc;
          }, []);
          console.log(myRoles)

          if (!response.roles || response.roles.length <= 0 || myRoles.length <=0) reject('用户无角色！请稍后重新登陆！');          

          commit('SET_ROLES', myRoles);
          commit('SET_NAME', response.user.loginName);
          commit('SET_AVATAR', response.user.headImgUrl);
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
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
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

