
import React, { useState, useRef, useEffect } from 'react';
import type { Selection } from '../types';
import { GoogleGenAI, Modality } from '@google/genai';

type Point = { x: number; y: number };
type BrushStroke = Point[];

const VideoProcessor: React.FC = () => {
    const [step, setStep] = useState<'upload' | 'select' | 'processing' | 'done'>('upload');
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);
    const [selection, setSelection] = useState<Selection | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [progress, setProgress] = useState(0);
    const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
    const [beforeImageUrl, setBeforeImageUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toolMode, setToolMode] = useState<'select' | 'crop' | 'brush'>('brush');
    const [cropSelection, setCropSelection] = useState<Selection | null>(null);
    const [brushStrokes, setBrushStrokes] = useState<BrushStroke[]>([]);
    const [brushSize, setBrushSize] = useState(40);

    const mediaRef = useRef<HTMLVideoElement & HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const brushCanvasRef = useRef<HTMLCanvasElement>(null);

    const resetState = () => {
        setStep('upload');
        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        if (beforeImageUrl) URL.revokeObjectURL(beforeImageUrl);
        setMediaUrl(null);
        setMediaType(null);
        setSelection(null);
        setIsDrawing(false);
        setStartPoint(null);
        setProgress(0);
        setResultImageUrl(null);
        setBeforeImageUrl(null);
        setIsProcessing(false);
        setToolMode('brush');
        setCropSelection(null);
        setBrushStrokes([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
             if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else if (file.type.startsWith('image/')) {
                setMediaType('image');
            } else {
                alert('Upload venligst en gyldig video- eller billedfil.');
                return;
            }
            const url = URL.createObjectURL(file);
            setMediaUrl(url);
            setStep('select');
        }
    };

    const getMousePos = (e: React.MouseEvent<HTMLDivElement>): Point => {
        const rect = containerRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (step !== 'select' || isProcessing) return;
        const pos = getMousePos(e);
        setIsDrawing(true);

        if (toolMode === 'brush') {
             setBrushStrokes(prev => [...prev, [pos]]);
        } else {
            setStartPoint(pos);
            if (toolMode === 'crop') {
                setCropSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
            } else {
                setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || step !== 'select') return;
        const pos = getMousePos(e);

        if (toolMode === 'brush') {
             setBrushStrokes(prev => {
                const newStrokes = [...prev];
                const lastStroke = newStrokes[newStrokes.length - 1];
                if (lastStroke) {
                    lastStroke.push(pos);
                }
                return newStrokes;
            });
        } else if (startPoint) {
            const newRect = {
                x: Math.min(pos.x, startPoint.x),
                y: Math.min(pos.y, startPoint.y),
                width: Math.abs(pos.x - startPoint.x),
                height: Math.abs(pos.y - startPoint.y)
            };
            if (toolMode === 'crop') {
                setCropSelection(newRect);
            } else {
                setSelection(newRect);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setStartPoint(null);
    };

    const clearBrushStrokes = () => {
        setBrushStrokes([]);
        setSelection(null);
    };

    useEffect(() => {
        if (toolMode !== 'brush' || !brushCanvasRef.current) return;
        const canvas = brushCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx || !containerRef.current) return;
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.lineWidth = brushSize;
        brushStrokes.forEach(stroke => {
            if (stroke.length < 2) {
                const point = stroke[0];
                if (point) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
                    ctx.fill();
                }
            } else {
                ctx.beginPath();
                ctx.moveTo(stroke[0].x, stroke[0].y);
                for (let i = 1; i < stroke.length; i++) {
                    ctx.lineTo(stroke[i].x, stroke[i].y);
                }
                ctx.stroke();
            }
        });
    }, [brushStrokes, brushSize, toolMode, mediaUrl]);

    const handleApplyCrop = () => {
        if (!cropSelection || !mediaRef.current || !containerRef.current || cropSelection.width < 10 || cropSelection.height < 10) {
            alert('Vælg venligst et gyldigt område at beskære.');
            return;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const mediaElement = mediaRef.current;
        const containerElement = containerRef.current;
        const naturalWidth = mediaType === 'video' ? mediaElement.videoWidth : mediaElement.naturalWidth;
        const naturalHeight = mediaType === 'video' ? mediaElement.videoHeight : mediaElement.naturalHeight;
        const scaleX = naturalWidth / containerElement.clientWidth;
        const scaleY = naturalHeight / containerElement.clientHeight;
        const sourceX = cropSelection.x * scaleX;
        const sourceY = cropSelection.y * scaleY;
        const sourceWidth = cropSelection.width * scaleX;
        const sourceHeight = cropSelection.height * scaleY;
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
        ctx.drawImage(mediaElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        const newMediaUrl = canvas.toDataURL('image/png');
        if (mediaUrl && mediaUrl.startsWith('blob:')) {
            URL.revokeObjectURL(mediaUrl);
        }
        setMediaUrl(newMediaUrl);
        setMediaType('image');
        setCropSelection(null);
        setSelection(null);
        setBrushStrokes([]);
        setToolMode('brush');
    };

    const handleRemove = async () => {
        const isBrushMode = toolMode === 'brush' && brushStrokes.length > 0;
        const isSelectMode = toolMode === 'select' && selection && selection.width > 10 && selection.height > 10;
        if ((!isBrushMode && !isSelectMode) || !mediaRef.current || !containerRef.current) {
            alert('Markér venligst vandmærket først.');
            return;
        }
        setIsProcessing(true);
        setStep('processing');
        setProgress(5);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Fejl ved initialisering.');
            const mediaElement = mediaRef.current;
            const containerElement = containerRef.current;
            const naturalWidth = mediaType === 'video' ? mediaElement.videoWidth : mediaElement.naturalWidth;
            const naturalHeight = mediaType === 'video' ? mediaElement.videoHeight : mediaElement.naturalHeight;
            const scaleX = naturalWidth / containerElement.clientWidth;
            const scaleY = naturalHeight / containerElement.clientHeight;
            canvas.width = naturalWidth;
            canvas.height = naturalHeight;
            ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);
            setBeforeImageUrl(canvas.toDataURL('image/jpeg'));
            setProgress(20);
            const maskCanvas = document.createElement('canvas');
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx) throw new Error('Fejl ved maskering.');
            maskCanvas.width = canvas.width;
            maskCanvas.height = canvas.height;
            maskCtx.drawImage(canvas, 0, 0);
            if (isBrushMode) {
                maskCtx.lineCap = 'round';
                maskCtx.lineJoin = 'round';
                maskCtx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
                maskCtx.lineWidth = brushSize * scaleX;
                brushStrokes.forEach(stroke => {
                    if (stroke.length < 2) {
                        const point = stroke[0];
                        if (point) {
                            maskCtx.beginPath();
                            maskCtx.arc(point.x * scaleX, point.y * scaleY, (brushSize * scaleX) / 2, 0, Math.PI * 2);
                            maskCtx.fillStyle = 'rgba(168, 85, 247, 0.5)';
                            maskCtx.fill();
                        }
                    } else {
                        maskCtx.beginPath();
                        maskCtx.moveTo(stroke[0].x * scaleX, stroke[0].y * scaleY);
                        for (let i = 1; i < stroke.length; i++) {
                            maskCtx.lineTo(stroke[i].x * scaleX, stroke[i].y * scaleY);
                        }
                        maskCtx.stroke();
                    }
                });
            } else if (isSelectMode && selection) {
                 maskCtx.fillStyle = 'rgba(168, 85, 247, 0.5)';
                 maskCtx.fillRect(selection.x * scaleX, selection.y * scaleY, selection.width * scaleX, selection.height * scaleY);
            }
            setProgress(35);
            const base64Data = maskCanvas.toDataURL('image/jpeg').split(',')[1];
            setProgress(45);
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                        { text: 'Remove the purple marked area. Blend background seamlessly.' },
                    ],
                },
            });
            setProgress(95);
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setResultImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                    setStep('done');
                    setProgress(100);
                    setIsProcessing(false);
                    return;
                }
            }
            throw new Error('AI fejlede.');
        } catch (err) {
            console.error(err);
            alert('Noget gik galt. Prøv igen.');
            resetState();
        }
    };
    
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (step === 'processing' && isProcessing) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 90 ? prev : prev + 1));
            }, 300);
        }
        return () => clearInterval(interval);
    }, [step, isProcessing]);

    const renderContent = () => {
        switch (step) {
            case 'upload':
                return (
                    <div
                        className="w-full max-w-2xl mx-auto group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*,image/*" className="hidden" />
                        <div className="relative overflow-hidden bg-black/40 border border-white/10 rounded-[2.5rem] p-16 text-center cursor-pointer transition-all duration-500 hover:border-purple-500/50 hover:bg-white/[0.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10">
                                <div className="bg-white/5 border border-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-500 shadow-2xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black mb-3 text-white tracking-tight">Upload dit medie</h3>
                                <p className="text-gray-400 text-lg mb-6 font-light">Træk og slip filer her, eller klik for at gennemse</p>
                                <div className="flex justify-center gap-3 text-xs text-gray-500 font-bold tracking-wider uppercase">
                                    <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">MP4</span>
                                    <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">MOV</span>
                                    <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">JPG</span>
                                    <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">PNG</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'select':
            case 'processing':
                return (
                    <div className="w-full max-w-5xl mx-auto space-y-6">
                        {step === 'select' && (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-800/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="flex bg-gray-900/50 p-1.5 rounded-xl border border-white/5">
                                    <button onClick={() => setToolMode('brush')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${toolMode === 'brush' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        Pensel
                                    </button>
                                    <button onClick={() => setToolMode('select')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${toolMode === 'select' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        Rektangel
                                    </button>
                                    <button onClick={() => setToolMode('crop')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${toolMode === 'crop' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        Beskær
                                    </button>
                                </div>
                                
                                {toolMode === 'brush' && (
                                    <div className="flex items-center gap-4 flex-grow px-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Størrelse</span>
                                        <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="flex-grow h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                        <button onClick={clearBrushStrokes} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button onClick={resetState} className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">Afbryd</button>
                                    <button onClick={toolMode === 'crop' ? handleApplyCrop : handleRemove} className={`px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all transform hover:scale-105 ${toolMode === 'crop' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-purple-600 shadow-purple-500/20'}`}>
                                        {toolMode === 'crop' ? 'Anvend Beskæring' : 'Fjern Vandmærke'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center w-full bg-black/40 rounded-[2rem] p-4 md:p-8 border border-white/5 shadow-2xl">
                            <div
                                ref={containerRef}
                                className="relative inline-block max-w-full select-none"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {mediaType === 'video' ? <video ref={mediaRef} src={mediaUrl!} controls={step !== 'select'} className="max-w-full max-h-[70vh] rounded-xl block" loop autoPlay muted playsInline /> : <img ref={mediaRef} src={mediaUrl!} alt="Media" className="max-w-full max-h-[70vh] rounded-xl block" />}

                                {step === 'select' && (
                                    <div className="absolute inset-0 cursor-crosshair rounded-xl overflow-hidden">
                                        {toolMode === 'select' && selection && (
                                            <div className="absolute border-2 border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]" style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }} />
                                        )}
                                        {toolMode === 'brush' && <canvas ref={brushCanvasRef} className="absolute inset-0 pointer-events-none" />}
                                        {toolMode === 'crop' && cropSelection && (
                                            <div className="absolute border-2 border-blue-500 bg-blue-500/10" style={{ left: cropSelection.x, top: cropSelection.y, width: cropSelection.width, height: cropSelection.height }} />
                                        )}
                                    </div>
                                )}

                                {step === 'processing' && (
                                    <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md flex flex-col justify-center items-center rounded-xl">
                                        <div className="w-64 text-center">
                                            <div className="mb-6 relative">
                                                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-purple-400">{progress}%</span>
                                                </div>
                                            </div>
                                            <p className="text-lg font-bold text-white mb-2">Behandler med AI</p>
                                            <p className="text-xs text-gray-400">Dette kan tage et øjeblik...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'done':
                 return (
                    <div className="w-full max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Før</span>
                                    <span className="bg-black/50 text-gray-400 text-[10px] px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">Original</span>
                                </div>
                                <div className="bg-black/50 rounded-3xl p-2 border border-white/5 aspect-video flex items-center justify-center overflow-hidden">
                                    {beforeImageUrl && <img src={beforeImageUrl} alt="Original" className="max-w-full max-h-full rounded-2xl object-contain" />}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Efter</span>
                                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-lg shadow-purple-500/30">Renset af AIQ</span>
                                </div>
                                <div className="bg-black/50 rounded-3xl p-2 border border-purple-500/30 aspect-video flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 pointer-events-none"></div>
                                    {resultImageUrl && <img src={resultImageUrl} alt="Cleaned" className="max-w-full max-h-full rounded-2xl object-contain relative z-10" />}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                             <button onClick={() => {
                                 const link = document.createElement('a');
                                 link.href = resultImageUrl!;
                                 link.download = `aiq-labs-cleaned.png`;
                                 link.click();
                             }} className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 px-12 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] text-lg">
                                Download Billede
                            </button>
                             <button onClick={resetState} className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-bold py-4 px-10 rounded-2xl transition-all border border-white/10">
                                Start forfra
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <section id="processor" className="py-8 md:py-12 scroll-mt-24">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Powered by Aiq-labs.com</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white">
                    AIQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 italic">Magic Eraser</span>
                </h1>
                <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light leading-relaxed">
                    Professionel fjernelse af vandmærker. Perfekt til Nano Banana, Veo3, Sora2 og mere. 
                    <strong className="text-white font-medium"> Tegn blot over det uønskede element</strong>, og lad vores AI trylle det væk uden at du skal skrive noget.
                </p>
            </div>
            {renderContent()}
        </section>
    );
};

export default VideoProcessor;
