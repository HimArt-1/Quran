import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, X, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const QuranViewer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isRendering, setIsRendering] = useState(false);
    const [loadingError, setLoadingError] = useState(null);
    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);

    // Initial load of the PDF document
    useEffect(() => {
        if (!isOpen) return;

        const loadPdf = async () => {
            try {
                setLoadingError(null);
                const loadingTask = pdfjsLib.getDocument('/quran.pdf');
                const loadedPdf = await loadingTask.promise;
                setPdf(loadedPdf);
                setTotalPages(loadedPdf.numPages);
                // Quran starts from right to left, page 1 is the cover/fatiha
                setCurrentPage(1);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setLoadingError('عذراً، تعذر تحميل المصحف. الرجاء التأكد من اتصالك أو إعادة المحاولة.');
            }
        };

        loadPdf();
    }, [isOpen]);

    // Render the current page onto the canvas
    const renderPage = useCallback(async (pageNum) => {
        if (!pdf || !canvasRef.current) return;

        try {
            setIsRendering(true);

            // Cancel any pending render task
            if (renderTaskRef.current) {
                await renderTaskRef.current.cancel();
            }

            const page = await pdf.getPage(pageNum);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Calculate scale to fit width/height dynamically
            const container = canvas.parentElement;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight - 60; // Leave room for controls

            // Get original viewport to calculate ratios
            const unscaledViewport = page.getViewport({ scale: 1 });
            const scaleWidth = containerWidth / unscaledViewport.width;
            const scaleHeight = containerHeight / unscaledViewport.height;
            // Use the smaller scale so it fits entirely without cropping
            const scale = Math.min(scaleWidth, scaleHeight) * 0.95;

            const viewport = page.getViewport({ scale });

            // Support high definition displays
            const outputScale = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";

            const transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

            const renderContext = {
                canvasContext: context,
                transform: transform,
                viewport: viewport
            };

            renderTaskRef.current = page.render(renderContext);
            await renderTaskRef.current.promise;

        } catch (error) {
            if (error.name !== 'RenderingCancelledException') {
                console.error('Error rendering page:', error);
            }
        } finally {
            setIsRendering(false);
        }
    }, [pdf]);

    // Trigger render when page changes
    useEffect(() => {
        if (pdf) renderPage(currentPage);
    }, [pdf, currentPage, renderPage]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (isOpen && pdf) {
                renderPage(currentPage);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, pdf, currentPage, renderPage]);

    const handleNextPage = () => {
        // Next page goes to the LEFT in Arabic (increment page number)
        if (currentPage < totalPages && !isRendering) setCurrentPage(p => p + 1);
    };

    const handlePrevPage = () => {
        // Prev page goes to the RIGHT in Arabic (decrement page number)
        if (currentPage > 1 && !isRendering) setCurrentPage(p => p - 1);
    };

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
                    height: '100dvh',
                    backgroundColor: 'var(--color-primary)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: 'env(safe-area-inset-top)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem 2rem',
                        backgroundColor: 'var(--color-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        borderBottom: '1px solid var(--color-glass-border)',
                        flexShrink: 0
                    }}>
                        <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'var(--font-arabic-calligraphy)', fontSize: '1.5rem' }}>
                            المصحف الشريف
                        </h3>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setPdf(null);
                                setCurrentPage(1);
                            }}
                            className="btn-glass"
                            style={{ cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none' }}
                            title="إغلاق المصحف"
                        >
                            <X size={28} color="white" />
                        </button>
                    </div>

                    {/* PDF Container */}
                    <div style={{
                        flexGrow: 1,
                        backgroundColor: '#111',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {loadingError ? (
                            <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
                                <p>{loadingError}</p>
                            </div>
                        ) : !pdf ? (
                            <div style={{ color: 'var(--color-accent)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <Loader className="animate-spin" size={48} />
                                <p>جاري تحميل المصحف...</p>
                            </div>
                        ) : (
                            <>
                                {/* Controls Overlay */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    zIndex: 10
                                }}>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="btn-glass"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                    >
                                        <ChevronRight size={20} />
                                        الصفحة التالية
                                    </button>

                                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'bold' }}>
                                        صفحة {currentPage} من {totalPages}
                                    </span>

                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="btn-glass"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                                    >
                                        الصفحة السابقة
                                        <ChevronLeft size={20} />
                                    </button>
                                </div>

                                {/* Canvas Wrapper */}
                                <div style={{
                                    flexGrow: 1,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '1rem'
                                }}>
                                    <canvas
                                        ref={canvasRef}
                                        style={{
                                            boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                                            borderRadius: '4px',
                                            transition: 'opacity 0.2s ease',
                                            opacity: isRendering ? 0.7 : 1
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
