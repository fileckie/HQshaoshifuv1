import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || '诚挚邀请'
    const host = searchParams.get('host') || ''
    const date = searchParams.get('date') || ''

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0A',
            position: 'relative',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(196, 30, 58, 0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* 顶部装饰线 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              backgroundColor: '#c41e3a',
            }}
          />

          {/* 内容区域 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* 餐厅名称 */}
            <p
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.2em',
                marginBottom: 30,
                fontFamily: 'serif',
              }}
            >
              烧师富
            </p>

            {/* 红圈圈装饰 */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 30,
            }}>
              {['板', '前', '创', '作', '烧', '鸟'].map((char) => (
                <div
                  key={char}
                  style={{
                    width: 36,
                    height: 36,
                    border: '2px solid #c41e3a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#c41e3a', fontSize: 16, fontFamily: 'serif' }}>{char}</span>
                </div>
              ))}
            </div>

            {/* 副标题 */}
            <p
              style={{
                fontSize: 24,
                color: '#c41e3a',
                letterSpacing: '0.3em',
                marginBottom: 40,
                fontFamily: 'serif',
              }}
            >
              板前创作烧鸟
            </p>

            {/* 分隔线 */}
            <div
              style={{
                width: 60,
                height: 2,
                backgroundColor: '#c41e3a',
                marginBottom: 30,
              }}
            />

            {/* 宴请主题 */}
            <p
              style={{
                fontSize: 42,
                color: '#FFFFFF',
                marginBottom: 40,
                letterSpacing: '0.05em',
                fontFamily: 'serif',
              }}
            >
              {title}
            </p>

            {/* 主人和日期 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {host && (
                <p
                  style={{
                    fontSize: 26,
                    color: '#c41e3a',
                    letterSpacing: '0.1em',
                  }}
                >
                  组局：{host}
                </p>
              )}
              {date && (
                <p
                  style={{
                    fontSize: 22,
                    color: '#8A8A8A',
                    letterSpacing: '0.05em',
                  }}
                >
                  {date}
                </p>
              )}
            </div>
          </div>

          {/* 底部信息 */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <p
              style={{
                fontSize: 18,
                color: '#8A8A8A',
                letterSpacing: '0.15em',
              }}
            >
              环宇荟 · 板前创作烧鸟
            </p>
          </div>

          {/* 底部装饰线 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 6,
              backgroundColor: '#c41e3a',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
