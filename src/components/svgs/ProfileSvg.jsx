import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      transform={`scale(1.3)`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        clipRule="evenodd"
        d="M14.477 14H9.523a3.851 3.851 0 00-3.336 2.3C5.48 17.688 6.89 19 8.532 19h6.936c1.642 0 3.053-1.312 2.345-2.7a3.85 3.85 0 00-3.336-2.3zM15 8a3 3 0 11-6 0 3 3 0 016 0z"
        stroke={props.focused ? '#fff' : '#aaa'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
