import type { GlobalThemeOverrides } from 'naive-ui'

export const focusTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#171717', primaryColorHover: '#343434', primaryColorPressed: '#050505', primaryColorSuppl: '#4b4b4b',
    bodyColor: '#ffffff', cardColor: '#ffffff', modalColor: '#ffffff', popoverColor: '#ffffff', inputColor: '#ffffff',
    textColorBase: '#202020', textColor1: '#202020', textColor2: '#626262', textColor3: '#858585',
    borderColor: '#e8e8e8', dividerColor: '#eeeeee', borderRadius: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
  Button: { borderRadiusMedium: '10px', borderRadiusSmall: '8px', heightMedium: '40px' },
  Card: { borderRadius: '20px', borderColor: '#e8e8e8' },
  Input: { border: '1px solid #e8e8e8', borderHover: '1px solid #c5c5c5', borderFocus: '1px solid #999999', boxShadowFocus: '0 0 0 2px #00000008', caretColor: '#171717' },
  Select: { peers: { InternalSelection: { borderRadius: '10px' } } },
}
