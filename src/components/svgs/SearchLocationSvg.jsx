import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      transform={`scale(1.4)`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        clipRule="evenodd"
        d="M5 12A6 6 0 1117 12 6 6 0 015 12z"
        stroke={props.focused ? '#fff' : '#aaa'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M11 15l1.768-1.757a2.475 2.475 0 000-3.515 2.51 2.51 0 00-3.536 0 2.475 2.475 0 000 3.515L11 15z"
        stroke={props.focused ? '#fff' : '#aaa'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.472 16L19 19"
        stroke={props.focused ? '#fff' : '#aaa'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
