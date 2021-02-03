import { Plugin, Context } from '@nuxt/types'

// こっちだと redirect されても、plugin の処理が続行されてしまう
/*
const userPlugin: Plugin = async ({ $axios, redirect, route }) => {
  console.log('poyo', process.server, route.path)
  $axios.onError((error: any) => {
    if (error.response.status === 400) {
      redirect('/sorry')
      return Promise.resolve(false)
    }
  })
  const response = await $axios.get('https://httpbin.org/status/400')
  console.log({ response })
}
*/

// https://tech.mobilefactory.jp/entry/2020/12/09/100000
function createPlugin(plugin: Plugin): Plugin {
  return async (context, inject) => {
    try {
      await plugin(context, inject)
    } catch (error: any) {
      if (error.response.status === 400) {
        context.redirect('/sorry')
      }
    }
  }
}

const userPlugin: Plugin = createPlugin(async ({ $axios, route }) => {
  console.log('poyo', process.server, route.path)
  await $axios.get('https://httpbin.org/status/400')

  console.log('done')
})
export default userPlugin
