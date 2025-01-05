import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      style={{
        flex: 1,
      }}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M10 10H110V110H10z" stroke="red" fill="#00f" />
    </Svg>
  );
}

export default SvgComponent;
