import defaultSettings from '@/settings'

const title = defaultSettings.title || '历史办公文件查询系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
