import { useCallback, useEffect, useRef, useState } from 'react';
import useMediaQuery from '../lib/useMediaQueries';



export default function Sidebar(props: {
  threshold: number,
  sidebar: number,
  children: any[]
}) {
  const bigScreen = useMediaQuery('(min-width:' + props.threshold + 'px)');
  const [screenRef, setScreenRef] = useState<HTMLDivElement | null>(null);
  const [startDrag, setStartDrag] = useState(0);
  const [currentDrag, setCurrentDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [opened, setOpened] = useState(false);

  const difference = opened ?
    Math.min(currentDrag - startDrag, 0) :
    Math.max(currentDrag - startDrag, 0);

  const pointerDown = useCallback((e: any) => {
    setDragging(true);
    setStartDrag(e.touches[0].clientX);
    setCurrentDrag(e.touches[0].clientX);
  }, [dragging, startDrag, currentDrag]);

  const pointerUp = useCallback(() => {
    setDragging(false);
    if(difference > 0) {
      setOpened(true);
    } else if (difference < 0) {
      setOpened(false);
    }
  }, [dragging, currentDrag, startDrag, opened]);

  const pointerMove = useCallback((e: any) => {
    setCurrentDrag(e.touches[0].clientX);
  }, [dragging, currentDrag]);

  useEffect(() => {
    if(screenRef === null) return;
    screenRef.addEventListener('touchstart', pointerDown);
    screenRef.addEventListener('touchend', pointerUp);
    screenRef.addEventListener('touchmove', pointerMove);
    // screenRef.addEventListener('pointercancel', pointerUp);
    return () => {
      screenRef.removeEventListener('touchstart', pointerDown);
      screenRef.removeEventListener('touchend', pointerUp);
      screenRef.removeEventListener('touchmove', pointerMove);
      // screenRef.removeEventListener('pointercancel', pointerUp);
    };
  }, [screenRef, pointerUp, pointerDown]);

  return <div ref={setScreenRef} style={{
    width: '100%',
    height: '100%',
    position: 'relative',
    userSelect: 'none',
    // overflow: 'hidden',
  }}>
    <div
      style={{
        // background: 'red',
        width: bigScreen ? (props.sidebar + 'px') : '100%',
        height: '100%',
        display: 'inline-block',
        position: 'absolute',
        top: '0px',
        left: bigScreen ? '0px' : !dragging ? (opened ? '0px' : '-100%') : `calc(${difference}px ${opened ? '' : '- 100%'})`,
        zIndex: '1',
        transition: dragging ? 'none' : 'left 300ms linear, width 300ms linear',
      }}
    >{props.children[0]}</div>
    <div
      style={{
        // background: 'green',
        width: bigScreen ? 'calc(100% - ' + props.sidebar + 'px)' : '100%',
        height: '100%',
        display: 'inline-block',
        position: 'absolute',
        top: '0px',
        left: bigScreen ? (props.sidebar + 'px') : '0px',
        zIndex: '0',
        transition: 'left 300ms linear, width 300ms linear',
      }}
    >{props.children[1]}</div>
  </div>;
}