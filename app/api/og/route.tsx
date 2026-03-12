import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || '诚挚邀请'
    const host = searchParams.get('host') || ''
    const date = searchParams.get('date') || ''
    const restaurant = searchParams.get('restaurant') || '平江颂'

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
            backgroundColor: '#1A1A1A',
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
              background: 'radial-gradient(circle at 20% 50%, rgba(201, 169, 98, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(201, 169, 98, 0.05) 0%, transparent 40%)',
            }}
          />
          
          {/* 顶部装饰线 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              backgroundColor: '#C9A962',
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
                fontSize: 24,
                color: '#C9A962',
                letterSpacing: '0.4em',
                marginBottom: 40,
                textTransform: 'uppercase',
              }}
            >
              {restaurant}
            </p>

            {/* 主标题 */}
            <h1
              style={{
                fontSize: 72,
                fontWeight: 400,
                color: '#FFFFFF',
                marginBottom: 20,
                letterSpacing: '0.1em',
                fontFamily: 'serif',
              }}
            >
              诚挚邀请
            </h1>

            {/* 分隔线 */}
            <div
              style={{
                width: 80,
                height: 2,
                backgroundColor: '#C9A962',
                marginBottom: 30,
              }}
            />

            {/* 宴请主题 */}
            <p
              style={{
                fontSize: 48,
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
                    fontSize: 28,
                    color: '#C9A962',
                    letterSpacing: '0.1em',
                  }}
                >
                  设宴：{host}
                </p>
              )}
              {date && (
                <p
                  style={{
                    fontSize: 24,
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
                fontSize: 20,
                color: '#8A8A8A',
                letterSpacing: '0.2em',
              }}
            >
              金海华餐饮集团 · 米其林一星
            </p>
          </div>

          {/* 底部装饰线 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 8,
              backgroundColor: '#C9A962',
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
