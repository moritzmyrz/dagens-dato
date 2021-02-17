import React from "react";
import Helmet from "react-helmet";
import { GetMonth } from "../functions/GetMonth";

type AppProps = {
  time: Date;
};

const Title: React.FC<AppProps> = ({ time }: AppProps) => {
  return (
    <>
      <Helmet title={`${time.getDate()} ${GetMonth(time.getMonth())}`} />
    </>
  );
};

export default Title;
