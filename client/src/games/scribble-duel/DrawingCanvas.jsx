import { useRef, useEffect, useCallback, useMemo } from 'react';
import { cn, throttle } from '../../lib/utils';

// Hex to RGBA helper for flood fill
function hexToRgba(hex) {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
    a: 255,
  };
}

// Flood fill algorithm
function floodFill(ctx, x, y, fillColorHex, canvasWidth, canvasHeight) {
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imageData.data;
  
  const startPos = (y * canvasWidth + x) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  const fillRgba = hexToRgba(fillColorHex);

  if (startR === fillRgba.r && startG === fillRgba.g && startB === fillRgba.b && startA === fillRgba.a) {
    return;
  }

  const matchStartColor = (pos) => {
    return (
      data[pos] === startR &&
      data[pos + 1] === startG &&
      data[pos + 2] === startB &&
      data[pos + 3] === startA
    );
  };

  const colorPixel = (pos) => {
    data[pos] = fillRgba.r;
    data[pos + 1] = fillRgba.g;
    data[pos + 2] = fillRgba.b;
    data[pos + 3] = fillRgba.a;
  };

  const pixelStack = [[x, y]];

  while (pixelStack.length) {
    const newPos = pixelStack.pop();
    const px = newPos[0];
    let py = newPos[1];

    let pixelPos = (py * canvasWidth + px) * 4;

    while (py >= 0 && matchStartColor(pixelPos)) {
      py -= 1;
      pixelPos -= canvasWidth * 4;
    }

    pixelPos += canvasWidth * 4;
    py += 1;

    let reachLeft = false;
    let reachRight = false;

    while (py < canvasHeight && matchStartColor(pixelPos)) {
      colorPixel(pixelPos);

      if (px > 0) {
        if (matchStartColor(pixelPos - 4)) {
          if (!reachLeft) {
            pixelStack.push([px - 1, py]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (px < canvasWidth - 1) {
        if (matchStartColor(pixelPos + 4)) {
          if (!reachRight) {
            pixelStack.push([px + 1, py]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      py += 1;
      pixelPos += canvasWidth * 4;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

export default function DrawingCanvas({
  isDrawer,
  onStroke,
  incomingStroke,
  clearSignal,
  color = '#0F172A',
  brushWidth = 4,
  activeTool = 'brush', // brush, fill, rectangle, circle
  className = '',
}) {
  const mainCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const mainCtxRef = useRef(null);
  const previewCtxRef = useRef(null);
  
  const isDrawing = useRef(false);
  const startPos = useRef(null);
  const lastPoint = useRef(null);

  // Setup canvases with high-DPI crisp rendering
  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!mainCanvas || !previewCanvas) return;

    const setupCanvas = (canvas, ctxRef) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctxRef.current = ctx;
    };

    setupCanvas(mainCanvas, mainCtxRef);
    setupCanvas(previewCanvas, previewCtxRef);

    const handleResize = () => {
      const dataUrl = mainCanvas.toDataURL();
      setupCanvas(mainCanvas, mainCtxRef);
      setupCanvas(previewCanvas, previewCtxRef);
      const img = new Image();
      img.onload = () => {
        mainCtxRef.current?.drawImage(img, 0, 0, mainCanvas.getBoundingClientRect().width, mainCanvas.getBoundingClientRect().height);
      };
      img.src = dataUrl;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clear canvas signal
  useEffect(() => {
    if (clearSignal > 0) {
      const canvas = mainCanvasRef.current;
      const ctx = mainCtxRef.current;
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    }
  }, [clearSignal]);

  // Execute drawing actions
  const executeAction = useCallback((ctx, canvas, action, isPreview = false) => {
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    if (action.type === 'fill' && !isPreview) {
      const px = Math.floor(action.x * canvas.width);
      const py = Math.floor(action.y * canvas.height);
      floodFill(ctx, px, py, action.color || '#0F172A', canvas.width, canvas.height);
      return;
    }

    ctx.strokeStyle = action.color || '#0F172A';
    ctx.lineWidth = action.width || 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (action.type === 'shape') {
      const x1 = action.x1 * rect.width;
      const y1 = action.y1 * rect.height;
      const x2 = action.x2 * rect.width;
      const y2 = action.y2 * rect.height;
      
      ctx.beginPath();
      if (action.shape === 'rectangle') {
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
      } else if (action.shape === 'circle') {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
    } else {
      // Stroke
      const x = action.x * rect.width;
      const y = action.y * rect.height;
      if (action.isNewStroke) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.1, y + 0.1);
        ctx.stroke();
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }, []);

  // Handle incoming network strokes
  useEffect(() => {
    if (!incomingStroke) return;
    executeAction(mainCtxRef.current, mainCanvasRef.current, incomingStroke);
  }, [incomingStroke, executeAction]);

  const getCanvasCoords = useCallback((clientX, clientY) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  }, []);

  // Throttled stroke emitter
  const emitStroke = useMemo(() => throttle((strokeData) => {
    if (onStroke) onStroke(strokeData);
  }, 25), [onStroke]);

  const startDrawing = useCallback((clientX, clientY) => {
    if (!isDrawer) return;
    const point = getCanvasCoords(clientX, clientY);
    if (!point) return;

    if (activeTool === 'fill') {
      const action = { type: 'fill', x: point.x, y: point.y, color };
      executeAction(mainCtxRef.current, mainCanvasRef.current, action);
      if (onStroke) onStroke(action);
      return;
    }

    isDrawing.current = true;
    startPos.current = point;
    lastPoint.current = point;

    if (activeTool === 'brush') {
      const action = { type: 'stroke', x: point.x, y: point.y, color, width: brushWidth, isNewStroke: true };
      executeAction(mainCtxRef.current, mainCanvasRef.current, action);
      emitStroke(action);
    }
  }, [isDrawer, activeTool, getCanvasCoords, color, executeAction, onStroke, brushWidth, emitStroke]);

  const moveDrawing = useCallback((clientX, clientY) => {
    if (!isDrawer || !isDrawing.current) return;
    const point = getCanvasCoords(clientX, clientY);
    if (!point) return;

    if (activeTool === 'brush') {
      const action = { type: 'stroke', x: point.x, y: point.y, color, width: brushWidth, isNewStroke: false };
      executeAction(mainCtxRef.current, mainCanvasRef.current, action);
      emitStroke(action);
      lastPoint.current = point;
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      const pCtx = previewCtxRef.current;
      const pCanvas = previewCanvasRef.current;
      if (pCtx && pCanvas) {
        const rect = pCanvas.getBoundingClientRect();
        pCtx.clearRect(0, 0, rect.width, rect.height);
        executeAction(pCtx, pCanvas, {
          type: 'shape',
          shape: activeTool,
          x1: startPos.current.x,
          y1: startPos.current.y,
          x2: point.x,
          y2: point.y,
          color,
          width: brushWidth,
        }, true);
      }
    }
  }, [isDrawer, activeTool, getCanvasCoords, color, brushWidth, executeAction, emitStroke]);

  const endDrawing = useCallback((clientX, clientY) => {
    if (!isDrawer || !isDrawing.current) return;
    isDrawing.current = false;

    if (activeTool === 'rectangle' || activeTool === 'circle') {
      const point = clientX !== undefined ? getCanvasCoords(clientX, clientY) : lastPoint.current;
      if (!point) return;
      
      const pCtx = previewCtxRef.current;
      const pCanvas = previewCanvasRef.current;
      if (pCtx && pCanvas) {
        pCtx.clearRect(0, 0, pCanvas.getBoundingClientRect().width, pCanvas.getBoundingClientRect().height);
      }

      const action = {
        type: 'shape',
        shape: activeTool,
        x1: startPos.current.x,
        y1: startPos.current.y,
        x2: point.x,
        y2: point.y,
        color,
        width: brushWidth,
      };
      executeAction(mainCtxRef.current, mainCanvasRef.current, action);
      if (onStroke) onStroke(action);
    }
    
    startPos.current = null;
    lastPoint.current = null;
  }, [isDrawer, activeTool, getCanvasCoords, color, brushWidth, executeAction, onStroke]);

  // Touch Event Listeners: 1 finger draws; 2 fingers scroll the screen on tablets!
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !isDrawer) return;

    const onTouchStart = (e) => {
      if (e.touches.length > 1) return; // Allow 2-finger scroll on tablets!
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) startDrawing(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 1) return; // Allow 2-finger scroll on tablets!
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) moveDrawing(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (e) => {
      if (e.touches.length > 1) return;
      e.preventDefault();
      const touch = e.changedTouches?.[0];
      endDrawing(touch?.clientX, touch?.clientY);
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDrawer, startDrawing, moveDrawing, endDrawing]);

  return (
    <div className={cn('relative w-full aspect-[4/3] max-h-[55vh] rounded-2xl border border-surface-300 overflow-hidden shadow-sm bg-white', className)}>
      <canvas
        ref={mainCanvasRef}
        className="absolute inset-0 w-full h-full bg-white"
      />
      <canvas
        ref={previewCanvasRef}
        className={cn(
          'absolute inset-0 w-full h-full select-none',
          isDrawer ? (activeTool === 'fill' ? 'cursor-pointer' : 'cursor-crosshair') : 'cursor-default pointer-events-none'
        )}
        onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
        onMouseMove={(e) => moveDrawing(e.clientX, e.clientY)}
        onMouseUp={(e) => endDrawing(e.clientX, e.clientY)}
        onMouseLeave={(e) => endDrawing(e.clientX, e.clientY)}
        style={{ touchAction: isDrawer ? 'none' : 'auto' }}
      />
    </div>
  );
}
