import { ImageResponse } from 'next/og'

export const alt = 'Human 3.0 Assessment'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #312e81 0%, transparent 50%), radial-gradient(circle at 75% 75%, #7c3aed 0%, transparent 50%)',
        }}
      >
        {/* Main Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                3.0
              </span>
            </div>
            <span
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-2px',
              }}
            >
              Human 3.0
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              color: '#f8fafc',
              textAlign: 'center',
              marginBottom: '50px',
              fontWeight: '500',
            }}
          >
            Multidimensional Development Assessment
          </div>

          {/* Quadrants */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '100px',
                borderRadius: '16px',
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                border: '2px solid #3b82f6',
              }}
            >
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Quadrant 1</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>Mind</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '100px',
                borderRadius: '16px',
                backgroundColor: 'rgba(34, 197, 94, 0.3)',
                border: '2px solid #22c55e',
              }}
            >
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Quadrant 2</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>Body</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '100px',
                borderRadius: '16px',
                backgroundColor: 'rgba(168, 85, 247, 0.3)',
                border: '2px solid #a855f7',
              }}
            >
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Quadrant 3</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>Spirit</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '100px',
                borderRadius: '16px',
                backgroundColor: 'rgba(249, 115, 22, 0.3)',
                border: '2px solid #f97316',
              }}
            >
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Quadrant 4</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>Vocation</div>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: '50px',
              padding: '16px 40px',
              backgroundColor: '#f97316',
              borderRadius: '100px',
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
            }}
          >
            Discover Your Metatype
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '18px',
            color: '#64748b',
          }}
        >
          human3.org
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
