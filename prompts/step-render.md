# 实现按步渲染

使用场景：当我们将 Shortcode 和 Markdown 语法混合使用的时候，如果先把文件进行 Markdown 渲染。
Markdown 解析器会按照自己的规则对我们的 Shortcode 进行解析和渲染，生成 html 内容。
这会导致我们的 Shortcode 完整性遭到破坏，到 Shortcode 渲染器渲染的时候，就会出现错误。

所以我们需要提供分步渲染的功能。

我们将 Markdown 包含 Shortcode 的渲染分成两步。

1. 先由 Shortcode 渲染器将 Markdown 里的 Shortcode 全部替换成一个个的标识符
2. 将替换完成的 Markdown 内容交给 Markdown 渲染器进行渲染，得到渲染过后的 html 文件
3. 将得到的包含 Shortcode 标识符的内容再交给 Shortcode 渲染器进行渲染，从而生成完整，正确的 html 内容

## 渲染流程实现细节

1. 初步渲染，将所有的 Shortcode 都用唯一标识符替代， 以 _mdf_sc_<index> 代替。 
2. 最终渲染，当用户传入一段包含该标识符的内容后，我们将把所有占位符用真正的 Shortcode 渲染结果替换上

## 技术实现需要注意的地方

- 不改变现有的框架和设计
- 对现有的功能进行拓展，在 PageRenderOptions 里增加一个渲染配置项，当这一项标记为 true 时，启动新增渲染模式
- 提供一个新的方法，让用户可以传入 markdown 渲染后的结果，同时用上第一步里已经准备好的真实内容，将第一步里的占位符替换掉

