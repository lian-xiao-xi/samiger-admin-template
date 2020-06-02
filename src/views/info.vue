<template>
  <div class="app-container">
    <h2>1.介绍</h2>
    <p>本模板为基于vue-admin-template创建的后台管理系统模板</p>
    <ul>
      <li>
        <a href="https://panjiachen.github.io/vue-element-admin-site/zh/" target="_blank">文档</a>
      </li>
      <li>
        <a href="https://panjiachen.gitee.io/vue-element-admin/#/login?redirect=%2Fdashboard" target="_blank">集成版预览地址</a>
      </li>
      <li>
        <a href="https://panjiachen.github.io/vue-admin-template/#/login?redirect=%2Fdashboard" target="_blank">基础版预览地址</a>
      </li>
    </ul>
    <h2>2.配置</h2>
    <p>仅记录一些比较重要的配置，全部配置见文档</p>
    <ul>
      <li>
        <a href="https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E9%85%8D%E7%BD%AE%E9%A1%B9" target="_blank">路由配置项</a>
      </li>
      <li>
        <a href="https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E4%BE%A7%E8%BE%B9%E6%A0%8F" target="_blank">动态生成侧边栏</a>
      </li>
      <li>
        <a href="https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/icon.html#%E7%94%9F%E6%88%90%E5%9B%BE%E6%A0%87%E5%BA%93%E4%BB%A3%E7%A0%81" target="_blank">图标的使用</a>
      </li>
    </ul>
    <h2>3.权限</h2>
    <p>权限的实现方式是：通过获取当前用户的权限去比对路由表，生成当前用户具的权限可访问的路由表，通过 router.addRoutes 动态挂载到 router 上。</p>
    <p>你可以在settings.js里的systemRoles配置当前系统可用权限的code和name</p>
    <p>比路由更详细的权限控制可以使用v-permission指令或者根据store.getters.roles来判断</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
a:hover {
  color: skyblue;
}
li {
  margin: 5px 0;
}
</style>
