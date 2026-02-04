import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { articleMocks } from './article.mock'
import { userMocks } from './user.mock'

// 创建 mock 适配器
const mock = new MockAdapter(axios, {
  delayResponse: 300, // 模拟网络延迟
  onNoMatch: 'passthrough'
})

// 初始化所有 mock
export function initMock() {
  // 文章相关
  mock.onGet('/api/articles').reply(articleMocks.getArticles)
  mock.onGet(/\/api\/articles\/\d+/).reply(articleMocks.getArticleById)
  mock.onGet('/api/tags').reply(articleMocks.getTags)
  mock.onGet('/api/archives').reply(articleMocks.getArchives)
  mock.onGet('/api/search').reply(articleMocks.searchArticles)

  // 用户相关
  mock.onGet('/api/user').reply(userMocks.getUser)

  console.log('[Mock] Mock server initialized')
}

export default mock
