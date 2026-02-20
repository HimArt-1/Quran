import { useState, useEffect, useMemo } from 'react';

const TOTAL_PAGES = 604; // Pages in Hafs Madinah Mushaf

export const useProgress = () => {
    // 1. Manage Target Days
    const [targetDays, setTargetDays] = useState(() => {
        try {
            const storedDays = localStorage.getItem('quranTargetDays');
            return storedDays ? parseInt(storedDays, 10) : 30; // Default 30 days
        } catch {
            return 30;
        }
    });

    // 2. Manage Progress Array (length = targetDays)
    const [progress, setProgress] = useState(() => {
        const initialTargetDays = (() => {
            try {
                const storedDays = localStorage.getItem('quranTargetDays');
                return storedDays ? parseInt(storedDays, 10) : 30;
            } catch {
                return 30;
            }
        })();

        try {
            const storedProgress = localStorage.getItem('quranTrackerProgress');
            if (storedProgress) {
                const parsed = JSON.parse(storedProgress);
                // Ensure the array matches current target days
                if (parsed.length === initialTargetDays) return parsed;
            }
        } catch (error) {
            console.error('Error reading from localStorage', error);
        }
        return Array(initialTargetDays).fill(false);
    });

    // 3. Generate Plan Algorithm
    const plan = useMemo(() => {
        const dailyPages = Math.floor(TOTAL_PAGES / targetDays);
        let remainder = TOTAL_PAGES % targetDays;

        const calculatedPlan = [];
        let currentPage = 1;

        for (let i = 0; i < targetDays; i++) {
            // Distribute remainder pages 1 by 1 across the first 'remainder' days
            const pagesToday = dailyPages + (remainder > 0 ? 1 : 0);
            remainder--;

            const endPage = currentPage + pagesToday - 1;

            calculatedPlan.push({
                dayNum: i + 1,
                startPage: currentPage,
                endPage: endPage,
                pageCount: pagesToday
            });

            currentPage = endPage + 1;
        }
        return calculatedPlan;
    }, [targetDays]);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('quranTargetDays', targetDays.toString());
        localStorage.setItem('quranTrackerProgress', JSON.stringify(progress));
    }, [targetDays, progress]);

    // Actions
    const toggleDay = (dayIndex) => {
        setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[dayIndex] = !newProgress[dayIndex];
            return newProgress;
        });
    };

    const updateTargetDays = (newDays) => {
        if (newDays >= 3 && newDays <= 365) {
            if (window.confirm(`تغيير مدة الختمة إلى ${newDays} يوماً سيقوم بتصفير تقدمك الحالي وإعادة حساب مسار القراءة بأكمله. هل أنت متأكد؟`)) {
                setTargetDays(newDays);
                setProgress(Array(newDays).fill(false));
            }
        } else {
            alert("الرجاء إدخال مدة صحيحة بين 3 و 365 يوماً.");
        }
    };

    const resetProgress = () => {
        if (window.confirm('هل أنت متأكد من رغبتك في تصفير تقدمك والبدء من جديد؟')) {
            setProgress(Array(targetDays).fill(false));
        }
    };

    const completedCount = progress.filter(Boolean).length;
    const percentage = Math.round((completedCount / targetDays) * 100) || 0;

    return { plan, progress, toggleDay, resetProgress, completedCount, percentage, targetDays, updateTargetDays };
};
