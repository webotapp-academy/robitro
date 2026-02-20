import { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';

export default function CertificateModal({ course, user, onClose }) {
    const certRef = useRef(null);

    const completionDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const handlePrint = () => {
        const content = certRef.current;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${course.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .cert-wrap { width: 1000px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="cert-wrap">${content.innerHTML}</div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        try {
            const { default: html2canvas } = await import('https://cdn.skypack.dev/html2canvas');
            const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true, backgroundColor: '#fff' });
            const link = document.createElement('a');
            link.download = `Certificate-${course.title.replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch {
            // Fallback: print if download fails
            handlePrint();
        }
    };

    const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">🏆 Your Certificate of Completion</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
                        >
                            <Printer size={15} /> Print
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-robitro-blue to-robitro-teal text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                        >
                            <Download size={15} /> Download
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Certificate */}
                <div className="p-6 overflow-auto max-h-[80vh]">
                    <div
                        ref={certRef}
                        style={{
                            fontFamily: "'Georgia', serif",
                            background: 'linear-gradient(135deg, #fefefe 0%, #f8faff 100%)',
                            border: '12px solid transparent',
                            borderImage: 'linear-gradient(135deg, #2563EB, #06B6D4, #F59E0B) 1',
                            position: 'relative',
                            padding: '60px 70px',
                            minHeight: '580px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        {/* Corner decorations */}
                        <div style={{ position: 'absolute', top: 16, left: 16, width: 60, height: 60, borderTop: '4px solid #2563EB', borderLeft: '4px solid #2563EB', borderRadius: '4px 0 0 0' }} />
                        <div style={{ position: 'absolute', top: 16, right: 16, width: 60, height: 60, borderTop: '4px solid #06B6D4', borderRight: '4px solid #06B6D4', borderRadius: '0 4px 0 0' }} />
                        <div style={{ position: 'absolute', bottom: 16, left: 16, width: 60, height: 60, borderBottom: '4px solid #F59E0B', borderLeft: '4px solid #F59E0B', borderRadius: '0 0 0 4px' }} />
                        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 60, height: 60, borderBottom: '4px solid #2563EB', borderRight: '4px solid #2563EB', borderRadius: '0 0 4px 0' }} />

                        {/* Logo / Header */}
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                                borderRadius: '50px', padding: '8px 24px', marginBottom: '4px'
                            }}>
                                <span style={{ fontSize: '20px' }}>🤖</span>
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '18px', fontFamily: 'sans-serif', letterSpacing: '1px' }}>ROBITRO ACADEMY</span>
                            </div>
                        </div>

                        {/* Gold Stars */}
                        <div style={{ fontSize: '28px', letterSpacing: '6px', marginBottom: '20px', color: '#F59E0B' }}>
                            ★ ★ ★ ★ ★
                        </div>

                        {/* Title */}
                        <p style={{ fontSize: '14px', letterSpacing: '6px', textTransform: 'uppercase', color: '#64748B', fontFamily: 'sans-serif', marginBottom: '8px' }}>
                            Certificate of Completion
                        </p>

                        <p style={{ fontSize: '15px', color: '#94A3B8', fontFamily: 'sans-serif', marginBottom: '24px' }}>
                            This is to certify that
                        </p>

                        {/* Student Name */}
                        <h1 style={{
                            fontSize: '48px',
                            fontFamily: "'Georgia', serif",
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '20px',
                            lineHeight: 1.1,
                        }}>
                            {userName}
                        </h1>

                        {/* Divider */}
                        <div style={{ width: '200px', height: '3px', background: 'linear-gradient(90deg, transparent, #F59E0B, transparent)', margin: '0 auto 24px' }} />

                        <p style={{ fontSize: '16px', color: '#475569', fontFamily: 'sans-serif', marginBottom: '10px' }}>
                            has successfully completed the course
                        </p>

                        {/* Course Name */}
                        <h2 style={{
                            fontSize: '28px',
                            fontFamily: "'Georgia', serif",
                            fontWeight: 700,
                            color: '#0F172A',
                            marginBottom: '28px',
                            maxWidth: '600px',
                            lineHeight: 1.3,
                        }}>
                            {course.title}
                        </h2>

                        {/* Badges */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
                            {[
                                { label: course.level || 'Beginner', icon: '📊' },
                                { label: 'Full Course', icon: '✅' },
                                { label: course.category || 'Technology', icon: '🎯' },
                            ].map((b, i) => (
                                <span key={i} style={{
                                    background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                                    color: '#1E40AF',
                                    padding: '6px 16px',
                                    borderRadius: '50px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    fontFamily: 'sans-serif',
                                    border: '1px solid #BFDBFE',
                                }}>
                                    {b.icon} {b.label}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ width: '120px', borderBottom: '2px solid #0F172A', marginBottom: '6px' }} />
                                <p style={{ fontSize: '12px', color: '#64748B', fontFamily: 'sans-serif' }}>Robitro Academy</p>
                                <p style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'sans-serif' }}>Authorised Signature</p>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '28px', margin: '0 auto 4px',
                                    boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
                                }}>
                                    🤖
                                </div>
                                <p style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'sans-serif' }}>OFFICIAL SEAL</p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ width: '120px', borderBottom: '2px solid #0F172A', marginBottom: '6px', marginLeft: 'auto' }} />
                                <p style={{ fontSize: '12px', color: '#64748B', fontFamily: 'sans-serif' }}>Date of Issue</p>
                                <p style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'sans-serif' }}>{completionDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
