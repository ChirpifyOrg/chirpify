import { useState, useEffect, RefObject } from 'react';

export function useFullscreen(containerRef: RefObject<HTMLDivElement | null>) {
   const [isFullscreen, setIsFullscreen] = useState(false);

   useEffect(() => {
      const handleFullscreenChange = () => {
         setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
   }, []);

   const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
         containerRef.current?.requestFullscreen();
         setIsFullscreen(true);
      } else {
         document.exitFullscreen();
         setIsFullscreen(false);
      }
   };

   return {
      isFullscreen,
      toggleFullscreen,
   };
}
