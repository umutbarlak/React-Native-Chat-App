import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const ChatIcon = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-message-circle-more"
    {...props}>
    <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    <Path d="M8 12h.01" />
    <Path d="M12 12h.01" />
    <Path d="M16 12h.01" />
  </Svg>
);
export default ChatIcon;
