import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      transform={`scale(1.3)`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M2.656 7.882a.75.75 0 10.688 1.333l-.688-1.333zm2.938.171a.75.75 0 00-.688-1.333l.688 1.333zM4.906 6.72a.75.75 0 10.688 1.333L4.906 6.72zm3.069-.74l.344.667h.001l-.345-.666zm8.05 0l-.345.667h.001l.344-.666zm2.381 2.073a.75.75 0 00.688-1.333l-.688 1.333zM6 7.387a.75.75 0 10-1.5 0H6zm-.75 7.432l.75.033v-.033h-.75zm3.808 4.18l-.037.75a.74.74 0 00.037 0V19zm5.885 0v.75a.75.75 0 00.037 0l-.037-.75zm3.807-4.18H18v.033l.75-.033zm.75-7.432a.75.75 0 00-1.5 0h1.5zm-.406-.667a.75.75 0 10-.688 1.333l.688-1.333zm1.562 2.495a.75.75 0 10.688-1.333l-.688 1.333zM9.25 19a.75.75 0 001.5 0h-1.5zm.75-2.231h.75v-.018l-.75.018zm2.125-2.23l.019-.75h-.038l.019.75zm2.125 2.23l-.75-.017v.018h.75zM13.5 19a.75.75 0 001.5 0h-1.5zM3.344 9.216l2.25-1.162-.688-1.333-2.25 1.162.688 1.333zm2.25-1.162l2.725-1.406-.688-1.333L4.906 6.72l.688 1.333zM8.32 6.647a8 8 0 017.36 0l.69-1.332c-2.74-1.42-6-1.42-8.74 0l.69 1.332zm7.361 0l2.725 1.406.688-1.333-2.725-1.406-.688 1.333zM4.5 7.387v7.432H6V7.387H4.5zm0 7.398a4.757 4.757 0 004.521 4.964l.073-1.498A3.257 3.257 0 016 14.852l-1.498-.067zm4.558 4.965h5.885v-1.5H9.058v1.5zm5.922-.001a4.757 4.757 0 004.52-4.964l-1.5.067a3.257 3.257 0 01-3.094 3.399l.074 1.498zm4.52-4.93V7.387H18v7.432h1.5zm-1.094-6.766l2.25 1.162.688-1.333-2.25-1.162-.688 1.333zM10.75 19v-2.231h-1.5v2.23h1.5zm0-2.249a1.43 1.43 0 011.394-1.462l-.038-1.5a2.93 2.93 0 00-2.856 2.997l1.5-.035zm1.356-1.462a1.43 1.43 0 011.394 1.463l1.5.036a2.93 2.93 0 00-2.856-2.999l-.038 1.5zm1.394 1.48V19H15v-2.23h-1.5z"
        fill={props.focused ? '#fff' : '#aaa'}
      />
    </Svg>
  );
}

export default SvgComponent;
