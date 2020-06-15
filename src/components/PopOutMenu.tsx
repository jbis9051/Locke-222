import React, { useCallback, useEffect, useState } from 'react';
import './PopOutMenu.css';

const OFFSET_X = 20;
const BOTTOM_OFFSET = 10;
const func: any = null;

interface IPopOutMenuProps {
    visible: boolean;
    elRect: DOMRect | undefined;
    direction: 'left' | 'right' | 'bottom';
    shouldClose?: () => void;
}

const PopOutMenu: React.FunctionComponent<IPopOutMenuProps> = ({
    children,
    visible,
    elRect,
    direction,
    shouldClose,
}) => {
    const [styles, setStyles] = useState({});

    const popOutMenu = useCallback(
        (popOutEl: HTMLDivElement) => {
            if (!popOutEl || !elRect) {
                return;
            }
            const popOutElRect = popOutEl.getBoundingClientRect();
            const style: Record<string, number> = {
                top: elRect.top + document.body.scrollTop,
                left: elRect.left + OFFSET_X + document.body.scrollLeft,
            };
            if (direction === 'bottom') {
                style.top += elRect.height + BOTTOM_OFFSET;
            }
            if (direction === 'left') {
                style.left = elRect.left + document.body.scrollLeft - popOutElRect.width - OFFSET_X;
            } else if (direction === 'right') {
                style.left = elRect.right - document.body.scrollLeft + OFFSET_X;
                // elRect.right + popOutElRect.width - OFFSET_X;
            }
            if (
                style.top + popOutElRect.height + BOTTOM_OFFSET >
                document.documentElement.clientHeight
            ) {
                delete style.top;
                style.bottom = BOTTOM_OFFSET;
            }
            style.width = popOutElRect.width; // we don't want it moving around
            setStyles(style);
        },
        [elRect, direction]
    );

    // todo: rethink this
    useEffect(() => {
        if (!shouldClose) {
            return;
        }
        if (visible) {
            setTimeout(() => {
                window.addEventListener('click', shouldClose);
            }, 0);
            window.addEventListener('resize', shouldClose);
        } else {
            window.removeEventListener('click', shouldClose);
            window.removeEventListener('resize', shouldClose);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    if (!visible) {
        return null;
    }
    return (
        <div ref={popOutMenu} className="popout-menu" style={styles}>
            {children}
        </div>
    );
};

export default PopOutMenu;
