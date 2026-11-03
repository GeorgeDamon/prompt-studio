# Prompt Studio

专注文本创作的提示词优化工作台，基于 [Prompt Optimizer](https://github.com/linshenkx/prompt-optimizer) v2.14.0 二次开发。

**[打开网页版](https://prompt-studio.itsleon-ma.chatgpt.site)** · **[下载 0.2.1](https://github.com/GeorgeDamon/prompt-studio/releases/tag/v0.2.1)**

## 功能

- ChatGPT 风格布局：侧栏导航、居中输入区、自定义图标和手机适配。
- 日常指令、角色设定、提示词优化与继续改写。
- 顶部只选择模型，侧栏单独管理接口与密钥。
- 历史、收藏和数据备份，数据保存在本设备。
- 44 条 prompts.chat 精选模板，支持中文分类与搜索，保留英文原文。
- PDF、DOCX、TXT、Markdown 本地提取文字并追加到输入中。

网页版公开访问，无需登录；模型请求需要自行配置可用接口。手机可添加到主屏幕（PWA），当前没有原生 IPA / APK。

## 下载

在 [Releases](https://github.com/GeorgeDamon/prompt-studio/releases) 下载：

| 文件 | 用途 |
| --- | --- |
| `PromptStudio-0.2.1-all.zip` | 完整交付包：源码、Web、Mac、Windows、文档、截图和校验信息 |
| `PromptStudio-0.2.1-mac-arm64.dmg` | Apple Silicon Mac，拖入“应用程序”安装 |
| `PromptStudio-0.2.1-win-x64.zip` | Windows x64，完整解压后运行 PromptStudio.exe |
| `PromptStudio-0.2.1-web.zip` | 构建好的静态网页文件 |
| `PromptStudio-0.2.1-source.zip` | 构建时对应的完整源码快照 |

Mac ZIP 也包含在完整交付包中。每个发行文件的 SHA-256 见 `SHA256SUMS.txt`。

![Prompt Studio](docs/screenshots/prompt-library-preview.jpg)

## 开发

使用 Node.js `^24.22.1` 与 pnpm `10.6.1`。

```sh
pnpm install --frozen-lockfile
pnpm build:core
pnpm build:ui
pnpm build:web
pnpm -F @prompt-optimizer/web dev
```

构建桌面版：

```sh
pnpm -F @prompt-optimizer/desktop build:web
pnpm -F @prompt-optimizer/desktop exec electron-builder --publish never
```

桌面平台打包需要对应系统工具；自动更新已关闭。更多说明见 [发行说明](docs/distribution/README.md)、[交付验证](docs/distribution/DELIVERY.md) 和 [上游开发文档](docs/developer/development.md)。

## 验证与限制

相关单元测试、构建、类型检查及安装包完整性校验已通过；浏览器中实际检查了模板选择、PDF / DOCX 导入和模型选择菜单。

Windows 真机尚未实测，最新桌面包只完成构建和完整性检查。Mac 未经 Apple 公证，Windows 未代码签名。未进行真实模型 API 调用验证。

扫描版 PDF 需要先 OCR；本版导入不含 OCR。文件上限为 10 MB，PDF 最多 80 页，提取文字最多 60,000 字符。网页可公开访问，中国大陆网络直连尚未实测。

上游高级功能源码仍保留，但主界面隐藏相应入口。保留的上游自动发布工作流已归档到 `docs/upstream-workflows/`，本仓库不自动发布至上游。源码快照 ZIP 为 0.2.1 构建时的版本；本仓库另补充了当前网址、README 和交付资料。

## 来源与许可证

- 应用基于 [linshenkx/prompt-optimizer](https://github.com/linshenkx/prompt-optimizer)，基线提交 `a4c1934`，保留 [AGPL-3.0](LICENSE)。
- 模板数据来自 [f/prompts.chat](https://github.com/f/prompts.chat)，使用 CC0-1.0；具体来源见 `third_party/prompts-chat/`。
- PDF.js 使用 Apache-2.0，Mammoth 使用 BSD-2-Clause。
- 原项目介绍见 [README.upstream.md](README.upstream.md)。
