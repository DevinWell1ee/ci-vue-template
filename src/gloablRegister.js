import Vue from 'vue'

// webpack require.context(文件夹目录，是否搜索子目录，匹配文件正则表达)
const requireUiComponent = require.context(
  './components/', true, /\.vue$/
  // 找到components/ui-comp文件夹下以.vue命名的文件
)

requireUiComponent.keys().forEach(fileName => {
  const componentConfig = requireUiComponent(fileName)
  const componentName = componentConfig.default.name

  Vue.component(componentName, componentConfig.default || componentConfig)
})

