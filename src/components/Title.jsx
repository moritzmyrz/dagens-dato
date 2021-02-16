import React from "react";
import Helmet from "react-helmet";

import { GetMonth } from "../functions/GetMonth";

class Title extends React.PureComponent {
  render() {
    return (
      <>
        <Helmet
          title={`${this.props.time.getDate()} ${GetMonth(
            this.props.time.getMonth()
          )}`}
        />
      </>
    );
  }
}

export default Title;
