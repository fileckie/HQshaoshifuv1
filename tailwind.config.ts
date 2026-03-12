import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 使用日式衬线字体，内容为中文
        'serif': ['Noto Serif JP', 'Noto Serif SC', 'STSong', 'SimSun', 'serif'],
        'sans': ['Noto Sans JP', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      colors: {
        'black': '#0a0a0a',
        'white': '#ffffff',
        'red': {
          DEFAULT: '#c41e3a',
          dark: '#a01830',
          light: '#dc143c',
        },
      },
    },
  },
  plugins: [],
}

export default config
