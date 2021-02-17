import { GetMonth } from "functions/GetMonth";
import React from "react";
import Helmet from "react-helmet";

type AppProps = {
  time: Date;
};

const Title: React.FC<AppProps> = ({ time }: AppProps) => {
  return (
    <>
      <Helmet title={`${time.getDate()}. ${GetMonth(time.getMonth())}`} />
    </>
  );
};

export default Title;
