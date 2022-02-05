import React from 'react';


type Props = {
    connect: () => void;
}

export default function ConnectMenu(props: Props) {



    return <div className={"connect-menu no-select"} onClick={props.connect}> Connect </div>;
}
