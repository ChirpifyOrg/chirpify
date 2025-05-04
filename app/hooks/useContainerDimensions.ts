import { useState, useEffect, RefObject } from 'react';

// 컨테이너 크기 훅
export function useContainerDimensions(containerRef: RefObject<HTMLDivElement | null>) {
   const [containerHeight, setContainerHeight] = useState<number>(0);
   const [containerWidth, setContainerWidth] = useState<number>(0);

   useEffect(() => {
      const updateDimensions = () => {
         if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
            setContainerWidth(window.innerWidth);
         }
      };

      const resizeObserver = new ResizeObserver(updateDimensions);
      if (containerRef.current) {
         resizeObserver.observe(containerRef.current);
         updateDimensions();
      }

      window.addEventListener('resize', updateDimensions);

      return () => {
         resizeObserver.disconnect();
         window.removeEventListener('resize', updateDimensions);
      };
   }, []);

   return {
      containerHeight,
      containerWidth,
   };
}
