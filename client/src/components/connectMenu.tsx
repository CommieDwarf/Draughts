import React from 'react';


interface Props {
    connect: () => void;
}

export default function ConnectMenu(props: Props) {
    return <div className={"connect-menu no-select"} onClick={props.connect}> Connect </div>;
}
