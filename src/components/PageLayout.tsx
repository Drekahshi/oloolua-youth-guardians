'use client';


function PageHeader({ title, subtitle, bgImage }: { title: string; subtitle?: string; bgImage?: string }) {
  // Every inner page opens on a forest photo, darkened so the title reads clearly.
  const photo = bgImage || '/assets/images/forest2.jpeg';
  return (
    <header style={{ position: 'relative', overflow: 'hidden', background: '#0b1c14' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,28,20,0.45) 0%, rgba(11,28,20,0.92) 100%)' }} />
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: 'clamp(4rem, 9vw, 7rem) 1.25rem clamp(3rem, 6vw, 4.5rem)', textAlign: 'center' }}>
        <h1 style={{ color: '#f6f2e7', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, margin: 0, lineHeight: 1.1, textShadow: '0 4px 24px rgba(0,0,0,0.45)' }}>{title}</h1>
        {subtitle && <p style={{ color: '#d6e4da', margin: '1rem auto 0', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.6, maxWidth: 680 }}>{subtitle}</p>}
      </div>
    </header>
  );
}

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  bgImage?: string;
  showHeader?: boolean;
}

export default function PageLayout({ children, title, subtitle, bgImage, showHeader = true }: PageLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b1c14', color: '#f6f2e7', fontFamily: "'Roboto', sans-serif" }}>
      {showHeader && title && <PageHeader title={title} subtitle={subtitle} bgImage={bgImage} />}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
