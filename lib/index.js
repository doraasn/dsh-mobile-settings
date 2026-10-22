/**
 * dsh-mobile-settings — host half.
 *
 * 没有 host 侧行为：真正的改动是 client.js 里的一条 CSS 和一个 settings 分区。
 * 保留空 apply 是为了让插件出现在 profile 的 loader 树里，并让 dsh.client
 * 声明的浏览器入口被 web 宿主发现。
 */
export const name = 'mobile-settings-entry';

export function apply() {}
