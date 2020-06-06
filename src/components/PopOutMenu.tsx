import React, { useCallback, useEffect, useState } from 'react';
import './PopOutMenu.css';

const OFFSET_X = 20;
const BOTTOM_OFFSET = 10;
let needsToClose: null | { close: () => void; element: Element } = null; // TODO this is really bad

export default function PopOutMenu({
    children,
    visible,
    element,
    direction,
    shouldClose,
}: {
    children: React.ReactElement;
    visible: boolean;
    element: () => Element;
    direction: 'left' | 'right';
    shouldClose?: () => void;
}) {
    const [styles, setStyles] = useState({});
    const [viewportHeight, setViewportHeight] = useState(document.documentElement.clientHeight);
    const [viewportWidth, setViewportWidth] = useState(document.documentElement.clientWidth);

    const popOutMenu = useCallback(
        (popOutEl) => {
            const el = element();
            if (!popOutEl || !el) {
                return;
            }
            const elRect = el.getBoundingClientRect();
            const popOutElRect = popOutEl.getBoundingClientRect();
            const location: any = {
                top: elRect.top + document.body.scrollTop,
            };
            if (direction === 'left') {
                location.left =
                    elRect.left + document.body.scrollLeft - popOutElRect.width - OFFSET_X;
            } else {
                location.right =
                    elRect.right - document.body.scrollLeft + popOutElRect.width + OFFSET_X;
            }
            if (location.top + popOutElRect.height + BOTTOM_OFFSET > viewportHeight) {
                delete location.top;
                location.bottom = BOTTOM_OFFSET;
            }
            setStyles(location);
        },
        [viewportHeight, viewportWidth, children]
    );

    useEffect(() => {
        function updateViewportMeasurements() {
            setViewportHeight(document.documentElement.clientHeight);
            setViewportWidth(document.documentElement.clientWidth);
        }

        window.addEventListener('resize', updateViewportMeasurements);
        return () => window.removeEventListener('resize', updateViewportMeasurements);
    }, []);

    useEffect(() => {
        if (!shouldClose) {
            return;
        }
        if (visible) {
            if (needsToClose?.element !== element()) {
                needsToClose?.close();
            }
            needsToClose = {
                element: element(),
                close: shouldClose,
            };
            window.addEventListener('click', shouldClose);
        } else {
            if (needsToClose?.element === element()) {
                needsToClose = null;
            }
            window.removeEventListener('click', shouldClose);
        }
    }, [shouldClose, visible]);

    if (!visible) {
        return null;
    }
    return (
        <div ref={popOutMenu} className={'popout-menu'} style={styles}>
            {children}
        </div>
    );
}
