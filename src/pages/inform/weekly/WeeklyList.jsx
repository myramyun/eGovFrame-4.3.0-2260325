import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as TagLeftNav } from "@/components/leftmenu/EgovLeftNavInform";

function WeeklyList(props) {
  const location = useLocation();

  /// 요일
  const DATE = new Date();
  const WEEK = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", ];
  const FIRSTDAY = new Date( DATE.getFullYear(), DATE.getMonth(), DATE.getDate() - DATE.getDay() );
  
  const getWeekOfMonth = v => ((v.getDate() + v.getDay()) / 7) | 0; /// 1주 ~ 6주
  const getTimeForm = v => v.substring(8, 10) + ":" + v.substring(10, 12);

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      schdulSe: "",
      year: FIRSTDAY.getFullYear(),
      month: FIRSTDAY.getMonth(),
      date: FIRSTDAY.getDate(),
      weekDay: FIRSTDAY.getDay(),
      weekOfMonth: getWeekOfMonth(FIRSTDAY),
    }
  );

  const changeDate = v => {
    const { o } = v;
    const { year: y, month: m, date: d } = searchCondition;

    v.d = new Date( v.y ? y + o : y, v.m ? m + o : m, v.w ? d +7*o : d );

    setSearchCondition({
      ...searchCondition,
      year: v.d.getFullYear(),
      month: v.d.getMonth(),
      date: v.d.getDate(),
      weekDay: v.d.getDay(),
      weekOfMonth: getWeekOfMonth(v.d),
    });
  };

  const [resultList, setResultList] = useState([]);
  const retrieveList = useCallback((srchcnd) => {
    const requestURL = "/schedule/week" + EgovNet.getQueryString(srchcnd);
    const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

    EgovNet.requestFetch(
      requestURL,
      requestOptions,
      (resp) => { setResultList(resp.result.resultList); },
      (resp) => { console.log("/// err response : ", resp); }
    );
  }, []);

  const TagBreadcrumbs = () => (
    <div className="location">
      <ul>
        <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
        <li> <Link to={URL.INFORM}>알림마당</Link> </li>
        <li>금주의 행사</li>
      </ul>
    </div>
  );

  useEffect(() => { retrieveList(searchCondition); }, [searchCondition]);

  return (
    <div className="container">
      <div className="c_wrap">
        <TagBreadcrumbs />{/* <!--// Breadcrumbs --> */}

        <div className="layout">
          <TagLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents WEEK_SCHEDULE" id="contents">
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2">금주의 행사</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li>
                  <label className="f_select" htmlFor="sel1">
                    <select name="schdulSe" id="sel1" title="조건"
                      value={searchCondition.schdulSe}
                      onChange={e => { setSearchCondition({ ...searchCondition, schdulSe: e.target.value, }); }}
                    >
                      <option value="">전체</option>
                      <option value="1">회의</option>
                      <option value="2">세미나</option>
                      <option value="3">강의</option>
                      <option value="4">교육</option>
                      <option value="5">기타</option>
                    </select>
                  </label>
                </li>
                <li>
                  <button className="prev" onClick={() => { changeDate({ y: CODE.DATE_YEAR, o: -1 }); }} ></button>
                  <span>{searchCondition.year}년</span>
                  <button className="next" onClick={() => { changeDate({ y: CODE.DATE_YEAR, o: 1 }); }} ></button>
                </li>
                <li className="half L">
                  <button className="prev" onClick={() => { changeDate({ m: CODE.DATE_MONTH, o: -1 }); }} ></button>
                  <span>{searchCondition.month + 1}월</span>
                  <button className="next" onClick={() => { changeDate({ m: CODE.DATE_MONTH, o: 1 }); }} ></button>
                </li>
                <li className="half R">
                  <button className="prev" onClick={() => { changeDate({ w: CODE.DATE_WEEK, o: -1}); }} ></button>
                  <span>{searchCondition.weekOfMonth + 1}주</span>
                  <button className="next" onClick={() => { changeDate({ w: CODE.DATE_WEEK, o: 1}); }} ></button>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD003">
              <div className="head">
                <span>날짜</span>
                <span>시간</span>
                <span>제목</span>
                <span>담당자</span>
              </div>
              <div className="result">
                {WEEK.map((item, index) => {
                  let scheduleDate = new Date( searchCondition.year, searchCondition.month, searchCondition.date + index );
                  let scheduleDateStr = scheduleDate.getFullYear() + "년 " + (scheduleDate.getMonth() + 1) + "월 " + scheduleDate.getDate() + "일 " + WEEK[scheduleDate.getDay()];
                  let scheduleBgDate = scheduleDate.getFullYear() + ("00" + (scheduleDate.getMonth() + 1).toString()).slice(-2) + ("00" + scheduleDate.getDate().toString()).slice(-2);

                  let daily = [];
                  resultList.forEach(e => {
                    // 하루짜리 일정일 경우 시작일과 날짜가 일치하면
                    if ( e.schdulBgnde.substring(0, 8) === e.schdulEndde.substring(0, 8) && e.schdulBgnde.substring(0, 8) === scheduleBgDate ) {
                      daily.push(e);
                    // 이틀 이상 일정일 경우 시작일이 날짜보다 작거나 같고 종료일이 날짜보다 크거나 같으면
                    } else if ( e.schdulBgnde.substring(0, 8) !== e.schdulEndde.substring(0, 8) && e.schdulBgnde.substring(0, 8) <= scheduleBgDate && e.schdulEndde.substring(0, 8) >= scheduleBgDate ) {
                      daily.push(e);
                    }
                  });

                  return (
                    <div className = "list_item" key = {index}>
                      <div>{scheduleDateStr}</div>
                      <div>
                        {daily.length === 0 ? ( 
                          <span>일정이 존재하지 않습니다.</span> 
                        ) : ( 
                          daily.map((e, i) => ( 
                            <Link key = {i} to = {{ pathname: URL.INFORM_WEEKLY_DETAIL }} state = {{ schdulId: e.schdulId, prevPath: URL.INFORM_WEEKLY, }} >
                              <span> {getTimeForm(e.schdulBgnde)} ~ {getTimeForm(e.schdulEndde)} </span>
                              <span>{e.schdulNm}</span>
                              <span>{e.userNm}</span>
                            </Link>  
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <!--// 게시판목록 --> */}

          </div>
          {/* <!--// 본문 --> */}

        </div>
      </div>
    </div>
  );
}

export default WeeklyList;
