import React from 'react';

export const ProgressBar = ({ percentage, completedCount, targetDays = 30 }) => {
    return (
        <div className="glass-panel progress-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>مستوى الإنجاز</h3>
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    {completedCount} / {targetDays} يوماً
                </span>
            </div>

            <div
                style={{
                    height: '12px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, var(--color-success), var(--color-accent))',
                        borderRadius: '10px',
                        transition: 'width 0.8s ease-in-out',
                        boxShadow: percentage > 0 ? '0 0 10px var(--color-accent-light)' : 'none'
                    }}
                />
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {percentage === 100
                    ? 'تقبل الله طاعتكم، وكل عام وأنتم بخير!'
                    : percentage >= 50
                        ? 'ما شاء الله، لقد قطعت شوطاً كبيراً!'
                        : 'ابدأ بقراءة وردك اليومي من المصحف الشريف'}
            </p>
        </div>
    );
};
