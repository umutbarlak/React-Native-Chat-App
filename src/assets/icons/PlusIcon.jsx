import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const PlusIcon = props => (
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
    className="lucide lucide-plus"
    {...props}>
    <Path d="M5 12h14" />
    <Path d="M12 5v14" />
  </Svg>
);
export default PlusIcon;
