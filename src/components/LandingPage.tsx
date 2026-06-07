import { ArrowRight, Star, Shield, Zap, Thermometer, Droplets, Wifi, CheckCircle, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type LandingPageProps = {
  onExplore: () => void;
  onLogin: () => void;
};

const features = [
  {
    icon: Thermometer,
    title: 'Kiểm soát nhiệt độ thông minh',
    desc: 'Duy trì nhiệt độ ổn định tự động, đảm bảo môi trường lý tưởng xuyên suốt chu kỳ ấp.',
    accent: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: Droplets,
    title: 'Điều chỉnh độ ẩm tự động',
    desc: 'Cảm biến độ ẩm chính xác cao, duy trì điều kiện tối ưu mà không cần can thiệp thủ công.',
    accent: '#06B6D4',
    bg: '#ECFEFF',
  },
  {
    icon: Wifi,
    title: 'Giám sát từ xa qua App',
    desc: 'Theo dõi và điều chỉnh thông số ngay trên điện thoại bất kỳ lúc nào, bất kỳ nơi đâu.',
    accent: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: Zap,
    title: 'Tiết kiệm điện năng',
    desc: 'Công nghệ cách nhiệt tiên tiến giảm đáng kể điện năng tiêu thụ so với máy ấp truyền thống.',
    accent: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: Shield,
    title: 'Bảo hành chính hãng',
    desc: 'Bảo hành toàn diện, hỗ trợ kỹ thuật tận nơi, cam kết đồng hành cùng khách hàng lâu dài.',
    accent: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: Star,
    title: 'Tỷ lệ nở cao vượt trội',
    desc: 'Hàng nghìn khách hàng ghi nhận tỷ lệ nở vượt trội nhờ công nghệ kiểm soát môi trường.',
    accent: '#EF4444',
    bg: '#FEF2F2',
  },
];

const stats = [
  { value: '10,000+', label: 'Khách hàng tin dùng' },
  { value: '98%', label: 'Tỷ lệ hài lòng' },
  { value: '63', label: 'Tỉnh thành phủ sóng' },
  { value: '5 năm', label: 'Kinh nghiệm' },
];

const reviews = [
  { name: 'Anh Minh Tuấn', loc: 'Đồng Nai', text: 'Máy ổn định, tỷ lệ nở ổn định sau nhiều mùa vụ. Rất hài lòng.' },
  { name: 'Chị Hương', loc: 'Bình Dương', text: 'App theo dõi tiện lợi, đi vắng vẫn kiểm soát được máy qua điện thoại.' },
  { name: 'Anh Văn Lợi', loc: 'Cần Thơ', text: 'Nhân viên hỗ trợ nhiệt tình, hướng dẫn cài đặt rõ ràng từ đầu.' },
  { name: 'Chị Thu Ba', loc: 'Tiền Giang', text: 'Đã thử nhiều hãng khác, IncuSmart vẫn là lựa chọn tốt nhất của tôi.' },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function LandingPage({ onExplore, onLogin }: LandingPageProps) {
  const featuresSection = useInView();
  const statsSection = useInView();
  const trustSection = useInView();

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Sora', 'Be Vietnam Pro', sans-serif", background: '#F8FAFF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
        .fade-up { opacity: 0; transform: translateY(32px); transition: all 0.65s cubic-bezier(.22,.68,0,1.2); }
        .fade-up.visible { opacity: 1; transform: none; }
        .fade-up-delay-1 { transition-delay: 0.1s; }
        .fade-up-delay-2 { transition-delay: 0.2s; }
        .fade-up-delay-3 { transition-delay: 0.3s; }
        .fade-up-delay-4 { transition-delay: 0.4s; }
        .fade-up-delay-5 { transition-delay: 0.5s; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(59,130,246,0.15); }
        .hero-glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .bounce-slow { animation: bounceSlow 2.4s ease-in-out infinite; }
        @keyframes bounceSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .btn-primary { background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); transition: all 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.45); }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        .stat-number { background: linear-gradient(135deg, #2563EB, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #312E81 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* glows */}
        <div className="hero-glow" style={{ width: 500, height: 500, background: '#3B82F6', opacity: 0.18, top: -100, left: -100 }} />
        <div className="hero-glow" style={{ width: 400, height: 400, background: '#8B5CF6', opacity: 0.2, bottom: 0, right: -80 }} />
        <div className="hero-glow" style={{ width: 200, height: 200, background: '#06B6D4', opacity: 0.15, top: '40%', left: '50%' }} />

        {/* grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, width: '100%' }}>
          {/* badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(96,165,250,0.35)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60A5FA', display: 'inline-block', position: 'relative' }}>
              <span className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #60A5FA' }} />
            </span>
            <span style={{ color: '#93C5FD', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>Giải pháp máy ấp trứng thông minh #1 Việt Nam</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 800, lineHeight: 1.12, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Máy Ấp Trứng{' '}
            <span style={{ background: 'linear-gradient(90deg, #60A5FA, #A78BFA, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              IncuSmart
            </span>
            <br />
            <span style={{ fontWeight: 300, fontSize: '0.85em', color: 'rgba(255,255,255,0.8)' }}>Nâng Tầm Chăn Nuôi</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: 580, lineHeight: 1.75, marginBottom: 40, fontWeight: 300 }}>
            Công nghệ kiểm soát nhiệt độ, độ ẩm tự động và giám sát từ xa —<br />
            <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>tin dùng bởi hàng nghìn hộ chăn nuôi trên toàn quốc.</strong>
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={onExplore} className="btn-primary" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
            }}>
              Khám phá sản phẩm <ArrowRight size={18} />
            </button>
            <button onClick={onLogin} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: 16, fontWeight: 500, transition: 'all 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              Đăng nhập
            </button>
          </div>

          {/* mini stats row */}
          <div style={{ display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {[['10K+', 'Khách hàng'], ['98%', 'Hài lòng'], ['63', 'Tỉnh thành']].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 400, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 32, position: 'relative', zIndex: 1, marginTop: 48 }}>
          <ChevronDown size={28} className="bounce-slow" style={{ color: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '96px 24px', background: '#fff' }}>
        <div ref={featuresSection.ref} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className={`fade-up ${featuresSection.inView ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#2563EB', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Tại sao chọn chúng tôi</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Tại sao chọn IncuSmart?
            </h2>
            <p style={{ color: '#64748B', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
              Thiết kế dựa trên nhu cầu thực tế của người chăn nuôi Việt Nam, kết hợp công nghệ tiên tiến và độ bền vượt trội.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`card-hover fade-up fade-up-delay-${Math.min(i + 1, 5)} ${featuresSection.inView ? 'visible' : ''}`}
                style={{
                  background: '#fff', borderRadius: 20, padding: '28px 28px',
                  border: '1px solid #F1F5F9', display: 'flex', gap: 20, alignItems: 'flex-start',
                  boxShadow: '0 2px 16px rgba(15,23,42,0.05)',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: f.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <f.icon size={24} style={{ color: f.accent }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: '#0F172A', marginBottom: 8, fontSize: 15 }}>{f.title}</h3>
                  <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)',
        padding: '64px 24px',
      }}>
        <div ref={statsSection.ref} style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`fade-up fade-up-delay-${i + 1} ${statsSection.inView ? 'visible' : ''}`}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 8, fontWeight: 400 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST + REVIEWS ── */}
      <section style={{ padding: '96px 24px', background: '#F8FAFF' }}>
        <div ref={trustSection.ref} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64, alignItems: 'center' }}>
            {/* left */}
            <div className={`fade-up ${trustSection.inView ? 'visible' : ''}`}>
              <p style={{ color: '#2563EB', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Cam kết dịch vụ</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#0F172A', marginBottom: 28, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Được tin dùng<br />trên toàn quốc
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
                {[
                  'Giao hàng tận nơi, lắp đặt hướng dẫn miễn phí',
                  'Bảo hành toàn diện, hỗ trợ kỹ thuật nhanh chóng',
                  'Đặt hàng trực tuyến dễ dàng, theo dõi đơn hàng realtime',
                  'Thanh toán linh hoạt — đặt cọc hoặc thanh toán toàn bộ',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <CheckCircle size={14} style={{ color: '#16A34A' }} />
                    </div>
                    <span style={{ color: '#374151', fontSize: 15, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={onLogin} className="btn-primary" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
              }}>
                Đăng ký ngay <ArrowRight size={17} />
              </button>
            </div>

            {/* reviews grid */}
            <div className={`fade-up fade-up-delay-2 ${trustSection.inView ? 'visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {reviews.map((r, i) => (
                <div key={r.name} style={{
                  background: '#fff', borderRadius: 20, padding: '22px 20px',
                  boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
                  border: '1px solid #F1F5F9',
                  transform: i % 2 === 1 ? 'translateY(20px)' : 'none',
                }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                    ))}
                  </div>
                  <p style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>"{r.text}"</p>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.name}</div>
                  <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>{r.loc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)',
        padding: '96px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-glow" style={{ width: 400, height: 400, background: '#3B82F6', opacity: 0.2, top: -100, left: '20%' }} />
        <div className="hero-glow" style={{ width: 300, height: 300, background: '#8B5CF6', opacity: 0.2, bottom: -80, right: '10%' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Sẵn sàng đặt hàng?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginBottom: 40, lineHeight: 1.75, fontWeight: 300 }}>
            Đăng ký tài khoản để xem đầy đủ thông số kỹ thuật, nhận tư vấn miễn phí và đặt hàng trực tuyến dễ dàng.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={onLogin} style={{
              padding: '15px 36px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: '#fff', color: '#1E3A8A', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
            >
              Đăng ký / Đăng nhập
            </button>
            <button onClick={onExplore} style={{
              padding: '15px 36px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: 16, fontWeight: 500, transition: 'all 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
            >
              Xem sản phẩm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
