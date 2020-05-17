import * as React from 'react';
import { Link } from 'react-router-dom';

import './style.sass';

export interface IJoinButtonProps {
	to: string
	img: string
	label: string
}

export default function JoinButton (props: IJoinButtonProps) {
	return (
    <Link to={props.to}>
        <img src={props.img} className="joinButtonLogo" />
        <p className="joinButtonLabel">{props.label}</p>
    </Link>
  );
}
