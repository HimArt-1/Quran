import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';

export const QuranViewer = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
                <h3 className="juz-title" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>المصحف الشريف (نسخة مجمع الملك فهد)</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    تصفح المصحف الشريف كاملاً بدون إنترنت، مطابق لنسخة مجمع الملك فهد.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsOpen(true)}
                    style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
                >
                    <BookOpen size={24} />
                    فتح المصحف للقراءة
                </button>
            </div>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'var(--color-primary)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '1rem 2rem',
                        backgroundColor: 'var(--color-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        borderBottom: '1px solid var(--color-glass-border)'
                    }}>
                        <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'var(--font-arabic-calligraphy)', fontSize: '1.5rem' }}>
                            المصحف الشريف
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn-glass"
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                border: 'none'
                            }}
                            title="إغلاق المصحف"
                        >
                            <X size={28} color="white" />
                        </button>
                    </div>
                    <div style={{ flexGrow: 1, backgroundColor: '#fff', position: 'relative' }}>
                        <object
                            data="/quran.pdf#view=FitH"
                            type="application/pdf"
                            style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}
                            title="المصحف الشريف"
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-primary)' }}>متصفحك لا يدعم عرض ملفات PDF مباشرة.</p>
                                <a href="/quran.pdf" download className="btn btn-primary" style={{ textDecoration: 'none' }}>تحميل المصحف</a>
                            </div>
                        </object>
                    </div>
                </div>
            )}
        </>
    );
};
