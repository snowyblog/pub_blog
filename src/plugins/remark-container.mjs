// remark-container — 将 :::type ... ::: 自定义容器转为 <div class="type">
// :::group 包裹多个代码块时，标签配置存入 data-code-group JSON，由 CodeGroupTabs 消费
//
// 标签文本规则（优先级从高到低）：
//   ```js <tag = test>  → 标签为 "test"
//   ```js <tag=test>    → 标签为 "test"
//   ```js file="app.js" → 标签为 "app.js"
//   ```js               → 标签为 "js"

const containerTypes = ["group"];

/** 从 code 节点的 meta 中解析标签名 */
function getTabLabel(node) {
  if (node.meta) {
    const fileMatch = node.meta.match(/file="([^"]+)"/);
    if (fileMatch) return fileMatch[1];
  }
  return node.lang || "text";
}

/** 递归收集节点树中的所有 code 节点 */
function collectCodeNodes(nodes) {
  const result = [];
  for (const node of nodes) {
    if (node.type === "code") {
      result.push(node);
    }
    if (node.children) {
      result.push(...collectCodeNodes(node.children));
    }
  }
  return result;
}

export function remarkContainer() {
  return (tree) => {
    const { children } = tree;
    let i = 0;

    while (i < children.length) {
      const node = children[i];

      // 匹配 :::type 开头
      if (node.type !== "paragraph" || node.children.length !== 1) {
        i++;
        continue;
      }
      const textNode = node.children[0];
      if (textNode.type !== "text") {
        i++;
        continue;
      }

      const match = textNode.value.match(/^:::(\w+)\s*$/);
      if (!match || !containerTypes.includes(match[1])) {
        i++;
        continue;
      }

      const type = match[1];
      const openIndex = i;

      // 查找对应的 ::: 结束标记
      let closeIndex = -1;
      for (let j = i + 1; j < children.length; j++) {
        const sibling = children[j];
        if (
          sibling.type === "paragraph" &&
          sibling.children.length === 1 &&
          sibling.children[0].type === "text" &&
          sibling.children[0].value.trim() === ":::"
        ) {
          closeIndex = j;
          break;
        }
      }

      if (closeIndex === -1) {
        i++;
        continue;
      }

      const innerNodes = children.slice(openIndex + 1, closeIndex);
      const codeNodes = collectCodeNodes(innerNodes);

      // 构建标签配置 JSON，存入 div 属性
      let extraAttr = "";
      if (codeNodes.length > 1) {
        const labels = codeNodes.map(getTabLabel);
        // 数组元素只含字母数字和点号，JSON 安全
        const json = JSON.stringify(labels);
        extraAttr = ` data-code-group='${json}'`;
      }

      // 替换起止标记为 HTML 包裹标签
      children[openIndex] = {
        type: "html",
        value: `<div class="${type}"${extraAttr}>`,
      };
      children[closeIndex] = {
        type: "html",
        value: `</div>`,
      };

      i = closeIndex + 1;
    }
  };
}
