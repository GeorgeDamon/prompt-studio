# Prompt Studio 0.2.1

基于 Prompt Optimizer v2.14.0 的独立发行版本。保留 AGPL-3.0 许可证与原始版权说明。

## 目标

- Web：静态网站，数据保存在当前浏览器；模型请求使用用户自行配置的服务。
- iPhone / Android：同一网站的可安装 PWA，添加到主屏幕后可独立打开。不是原生 IPA / APK，不通过 App Store / Google Play 分发。
- Mac：Apple Silicon 桌面应用，使用独立的 Prompt Studio 数据目录。
- Windows：x64 桌面应用，使用独立的 Prompt Studio 数据目录。

网页端与桌面端的数据分别存储；需要迁移时使用「数据备份」导出和导入。

## 手机安装

iPhone：用 Safari 打开网站，选择「分享」→「添加到主屏幕」。

Android：用 Chrome 打开网站，选择浏览器菜单中的「安装应用」或「添加到主屏幕」。入口文字依系统和浏览器版本而异。

离线时可以打开已缓存的界面；调用云端模型仍需要网络。首次安装与缓存需要联网完成。

## 桌面构建

上游要求 Node.js ^24.22.1 与 pnpm 10.6.1。安装依赖后，先依次构建 core、UI 和 Web，再执行 desktop 的 build:web。

Mac 打包目标为 dmg / zip；Windows 打包目标为 nsis / zip。使用 `--publish never`，不发布到上游仓库。当前发行关闭了自动更新，防止安装上游版本。

`packages/desktop/after-pack.cjs` 使用项目锁定的 resedit 更新 Windows 图标和文件信息，不依赖 Wine。`scripts/render-studio-icons.swift` 用于生成桌面图标。

当前没有配置 Apple Developer ID、Apple 公证或 Windows 代码签名证书。实际生成与验证结果以本轮交付记录为准。

## 0.2.0 新功能

内置 44 个 prompts.chat 精选模板，支持中文标签搜索与分类浏览；原始模板正文保持英文原文，采用 CC0-1.0。

文件导入使用 PDF.js（Apache-2.0）与 Mammoth（BSD-2-Clause）在设备本地提取文字。支持有文字层的 PDF、DOCX、TXT、Markdown；上限为每文件 10 MB、PDF 80 页、提取文字 60,000 字符。原始输入会保留，新材料追加到其后。扫描版 PDF 需要先完成 OCR，本版不含 OCR。

Mac 提供 Apple Silicon 应用；Windows 提供解压即可运行的 x64 便携版。当前 Apple Silicon 构建环境无法运行上游 Intel 版 NSIS 编译器，因此本版不提供 Windows 安装向导。

## 0.2.1 界面与访问

网站 https://prompt-studio.itsleon-ma.chatgpt.site 现为公开访问，无需登录。没有内置共享模型密钥；模型设置、历史和收藏保存在本设备。

顶部「选择模型」只提供模型搜索与选择，侧栏「模型设置」管理接口与密钥。选择目录中的其他模型后，刷新模型列表会保留所选模型。
