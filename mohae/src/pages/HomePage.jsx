import React from "react";
import { Link } from "react-router-dom";
import { dummy_data } from "../data/dummy_data";

import CustomCalendar from "../components/calendar/CustomCalendar";

function HomePage() {
  return (
    <>
      <CustomCalendar>캘린더 테스트</CustomCalendar>
      <br />
      <Link to="detail/1">1번 페이지</Link>
      <br />
      <Link to="detail/2">2번 페이지</Link>
      <br />
      <Link to="detail/3">3번 페이지</Link>
    </>
  );
}

export default HomePage;
