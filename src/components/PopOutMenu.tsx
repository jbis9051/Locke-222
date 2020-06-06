import React, { useCallback, useEffect, useState } from 'react';
import './PopOutMenu.css';

const OFFSET_LEFT = -10;
const BOTTOM_OFFSET = 10;

export default function PopOutMenu({ children, visible, element }: { children: React.ReactElement, visible: boolean, element: () => Element }) {
    const [styles, setStyles] = useState({});
    const [viewportHeight, setViewportHeight] = useState(document.documentElement.clientHeight);
    const [viewportWidth, setViewportWidth] = useState(document.documentElement.clientWidth);

    const popOutMenu = useCallback((node) => {
        const el = element();
        if (!node || !el) {
            return;
        }
        const rect = el.getBoundingClientRect();
        const location: any = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft + OFFSET_LEFT,
        };
        const height = parseFloat(getComputedStyle(node!, null).height.replace('px', ''));
        if (location.top + height + BOTTOM_OFFSET > viewportHeight) {
            delete location.top;
            location.bottom = BOTTOM_OFFSET;
        }
        setStyles(location);
    }, [viewportHeight, viewportWidth]);


    useEffect(() => {
        function updateViewportMeasurements() {
            setViewportHeight(document.documentElement.clientHeight);
            setViewportWidth(document.documentElement.clientWidth);
        }

        window.addEventListener('resize', updateViewportMeasurements);
        return () => window.removeEventListener('resize', updateViewportMeasurements);
    }, []);

    if (!visible) {
        return null;
    }
    return (
        <div ref={popOutMenu} className={'popout-menu'} style={styles}>
            {children}
        </div>
    );
}
