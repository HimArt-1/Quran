import React from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { Tracker } from './components/Tracker';
import { QuranViewer } from './components/QuranViewer';
import { useProgress } from './hooks/useProgress';

function App() {
  const { plan, progress, toggleDay, resetProgress, completedCount, percentage, targetDays, updateTargetDays } = useProgress();

  return (
    <>
      <div className="bg-pattern" aria-hidden="true" />
      <div className="app-container">
        <Header />

        <main>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-accent)' }}>إعداد الختمة</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>أدخل عدد الأيام التي ترغب في ختم القرآن خلالها</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                min="3"
                max="365"
                value={targetDays}
                onChange={(e) => updateTargetDays(parseInt(e.target.value) || 30)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-glass-border)',
                  background: 'rgba(0,0,0,0.2)',
                  color: 'white',
                  width: '80px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-ui)'
                }}
              />
              <span>يوماً</span>
            </div>
          </div>

          <ProgressBar percentage={percentage} completedCount={completedCount} targetDays={targetDays} />

          <QuranViewer />

          <div className="tracker-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>جدول الختمة</h2>
              <button onClick={resetProgress} className="btn btn-glass" title="إعادة تعيين">
                تصفير الجدول
              </button>
            </div>

            <Tracker plan={plan} progress={progress} toggleDay={toggleDay} />
          </div>
        </main>

        <footer className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', marginTop: 'auto', lineHeight: '1.8' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-accent-light)', fontWeight: 'bold' }}>
            تم إنشاء التطبيق بواسطة "هيثم"
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            اللهم اجعل هذا التطبيق صدقة عني وعن أمي وأبي وأخواني ومن دخل بيتي مسلماً وعن المسلمين أجمعين ..
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
