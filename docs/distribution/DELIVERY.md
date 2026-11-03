# Prompt Studio 0.2.1 交付记录

网站：https://prompt-studio.itsleon-ma.chatgpt.site

2026-11-03 已按用户明确选择改为 public，网页无需登录。线上已实际打开并检查“选择模型”菜单，仅搜索和选择，没有配置/管理按钮。侧栏“模型设置”保留接口和密钥配置。

源代码快照：b28b96dbd59d257bef3e6240b19c32580d88946d
Sites 保存版本：4
发布状态：succeeded
部署 ID：appgdep_6ae9b76063f08191b476eb736e139002

## 文件

- desktop/PromptStudio-0.2.1-mac-arm64.dmg：Apple Silicon Mac，打开后拖入“应用程序”。
- desktop/PromptStudio-0.2.1-mac-arm64.zip：同一 Mac 应用的 ZIP。
- desktop/PromptStudio-0.2.1-win-x64.zip：Windows x64 便携版，完整解压后运行 PromptStudio.exe。
- PromptStudio-0.2.1-web.zip：独立静态 Web 文件。
- PromptStudio-0.2.1-source.zip：修改版源码，包含许可证与第三方说明。
- SHA256SUMS.txt / artifact-manifest.json：上述发行文件的校验信息。

手机使用同一网站，iPhone Safari“分享→添加到主屏幕”，Android Chrome“安装应用/添加到主屏幕”。当前为 PWA，没有原生 IPA/APK。

## 功能

ChatGPT 风格工作台；文本提示词优化与继续改写；历史、收藏、备份；44 条 prompts.chat CC0 原文模板；PDF/DOCX/TXT/Markdown 本地提取文字；顶部只选择模型，侧栏配置接口；各设备本地保存数据，无云端账号同步。

## 验证与限制

本轮模型选择相关 3 个测试文件、13 项测试通过；UI 构建与类型生成、Web 构建与类型检查通过。ZIP CRC、Mac DMG 校验、Mac codesign --verify --deep --strict、两平台 App 内的 0.2.1 版本与源码副本一致性检查通过，Windows FileVersion=0.2.1.0。

上一轮已实际验证网页模板搜索与使用、DOCX/PDF 导入和手机宽度布局，Mac 0.2.0 应用实际启动；本轮未另行启动 0.2.1 原生应用。原生文件选择器自动化未完成。Windows 真机和实体手机安装尚未实测。未执行真实模型 API 调用。

Mac 使用本地 ad hoc 签名，未进行 Apple 公证；Windows 未代码签名。Windows 本次为便携版，无安装向导。模型调用需要用户自行配置可用接口；扫描版 PDF 需先 OCR。公开访问只开放应用和源码，各访客的历史、收藏、密钥仍在自己的设备存储中。

不要打包整个 release 文件夹；smoke-profile 等是本机运行数据，不属于发行文件。
