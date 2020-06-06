import React, { useEffect, useRef, useState } from 'react';

function PopOutMenu({children, visible}: {children: React.Component, visible: boolean}) {
    const [styles, setStyles] = useState({});

    const popOutMenu = useRef(null);

    useEffect(() => {

    })

    if(!visible){
        return null;
    }
    return (
        <div ref={popOutMenu} className={"popout-menu"} style={styles}>

        </div>
    )
}
