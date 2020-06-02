import Layout from '@/layout'

export const userRoleRouter = {
  path: '/user-role',
  component: Layout,
  redirect: '/user-role/user',
  name: 'UserRole',
  meta: { title: '用户管理', icon: 'user-group', roles: ['admin'] },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/user-role/user'),
      meta: { title: '用户列表', icon: 'user-list' }
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/user-role/role'),
      meta: { title: '角色管理', icon: 'role-list' }
    },
    {
      path: 'permission',
      name: 'Permission',
      component: () => import('@/views/user-role/permission'),
      meta: { title: '权限管理', icon: 'permissions-list' }
    }
  ]
}
