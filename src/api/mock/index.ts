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
  mock.onGet('/api/articles').reply((config) => articleMocks.getArticles(config) as any)
  mock.onGet(/\/api\/articles\/\d+/).reply((config) => articleMocks.getArticleById(config) as any)
  mock.onGet('/api/tags').reply(() => articleMocks.getTags() as any)
  mock.onGet('/api/archives').reply(() => articleMocks.getArchives() as any)
  mock.onGet('/api/search').reply((config) => articleMocks.searchArticles(config) as any)

  // 用户相关
  mock.onGet('/api/user').reply(() => userMocks.getUser() as any)

  console.log('[Mock] Mock server initialized')
}

export default mock
