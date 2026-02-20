import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export const Tracker = ({ plan, progress, toggleDay }) => {
    return (
        <div className="tracker-grid">
            {plan.map((dayPlan, index) => {
                const isDone = progress[index];

                return (
                    <div
                        key={dayPlan.dayNum}
                        className={`glass-panel day-card ${isDone ? 'day-done' : ''}`}
                        onClick={() => toggleDay(index)}
                    >
                        <div className="day-header">
                            <span className="day-number">اليوم {dayPlan.dayNum}</span>
                            <button
                                className="status-icon"
                                aria-label={isDone ? 'Mark as unread' : 'Mark as read'}
                            >
                                {isDone ? (
                                    <CheckCircle2 color="var(--color-success)" fill="var(--color-glass)" size={28} />
                                ) : (
                                    <Circle color="var(--color-text-muted)" size={28} />
                                )}
                            </button>
                        </div>

                        <div className="day-body">
                            <h4 className="juz-title">قراءة اليوم</h4>
                            <p className="juz-pages" style={{ fontWeight: 'bold' }}>
                                جزء من ص {dayPlan.startPage} إلى ص {dayPlan.endPage}
                            </p>
                            <p className="juz-pages" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                (إجمالي: {dayPlan.pageCount} صفحة)
                            </p>
                        </div>

                        {isDone && <div className="glow-effect" />}
                    </div>
                );
            })}
        </div>
    );
};
