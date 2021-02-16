import React from "react";
import Helmet from "react-helmet";

import { getMonth } from "../functions/GetMonth";

class Title extends React.PureComponent {
  render() {
    return (
      <>
        <Helmet
          title={`${this.props.time.getDate()}. ${getMonth(
            this.props.time.getMonth()
          )}`}
        />
      </>
    );
  }
}

export default Title;
