import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        clipRule="evenodd"
        d="M10.69 7.85a1.834 1.834 0 10-3.054-2.032A1.834 1.834 0 0010.69 7.85zM10.69 18.165a1.834 1.834 0 10-3.054-2.032 1.834 1.834 0 003.054 2.032v0zM13.31 13.007a1.834 1.834 0 113.054-2.032 1.834 1.834 0 01-3.054 2.032v0z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 6.076a.75.75 0 000 1.5v-1.5zm8 1.5a.75.75 0 000-1.5v1.5zm-11.673 0a.75.75 0 000-1.5v1.5zM5 6.076a.75.75 0 000 1.5v-1.5zm6 10.316a.75.75 0 000 1.5v-1.5zm8 1.5a.75.75 0 000-1.5v1.5zm-11.673 0a.75.75 0 000-1.5v1.5zM5 16.392a.75.75 0 000 1.5v-1.5zm8-3.658a.75.75 0 000-1.5v1.5zm-8-1.5a.75.75 0 000 1.5v-1.5zm11.673 0a.75.75 0 000 1.5v-1.5zm2.327 1.5a.75.75 0 000-1.5v1.5zm-8-5.158h8v-1.5h-8v1.5zm-3.673-1.5H5v1.5h2.327v-1.5zM11 17.892h8v-1.5h-8v1.5zm-3.673-1.5H5v1.5h2.327v-1.5zM13 11.234H5v1.5h8v-1.5zm3.673 1.5H19v-1.5h-2.327v1.5z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
