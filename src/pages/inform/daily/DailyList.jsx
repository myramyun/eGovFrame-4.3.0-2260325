import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as TagLeftNav } from "@/components/leftmenu/EgovLeftNavInform";

function DailyList(props) {
  const location = useLocation();

  /// 날짜
  const DATE = new Date();
  const TODAY = new Date(DATE.getFullYear(), DATE.getMonth(), DATE.getDate());

  const getTimeForm = v => v.substring(8, 10) + ":" + v.substring(10, 12);
  
  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      schdulSe: "",
      year: TODAY.getFullYear(),
      month: TODAY.getMonth(),
      date: TODAY.getDate(),
    }
  );

   const changeDate = v => {
    const { o } = v
    const { year: y, month: m, date: d } = searchCondition;

    v.d = new Date( v.y ? y + o : y, v.m ? m + o : m, v.d ? d + o : d );
    
    setSearchCondition({
      ...searchCondition,
      year: v.d.getFullYear(),
      month: v.d.getMonth(),
      date: v.d.getDate(),
    });
  };

  /// init 초기 요청 및 조건 요청
  const [resultList, setResultList] = useState([]);
  const retrieveList = useCallback((srchcnd) => {
    const requestURL = "/schedule/daily" + EgovNet.getQueryString(srchcnd);
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
        <li>오늘의 행사</li>
      </ul>
    </div>
  );

  useEffect(() => { retrieveList(searchCondition); }, [searchCondition]);

  return (
    <div className="container">
      <div className="c_wrap">
        <TagBreadcrumbs /> {/* <!--// Breadcrumbs --> */}

        <div className="layout">
          <TagLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents TODAY_SCHEDULE" id="contents">
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2">오늘의 행사</h2>

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
                  <button className="prev" onClick={() => { changeDate({ y: CODE.DATE_YEAR, o: -1}); }} ></button>
                  <span>{searchCondition.year}년</span>
                  <button className="next" onClick={() => { changeDate({ y: CODE.DATE_YEAR, o: 1}); }} ></button>
                </li>
                <li className="half L">
                  <button className="prev" onClick={() => { changeDate({ m: CODE.DATE_MONTH, o: -1}); }} ></button>
                  <span>{searchCondition.month + 1}월</span>
                  <button className="next" onClick={() => { changeDate({ m: CODE.DATE_MONTH, o: 1}); }} ></button>
                </li>
                <li className="half R">
                  <button className="prev" onClick={() => { changeDate({ d: CODE.DATE_DATE, o: -1}); }} ></button>
                  <span>{searchCondition.date}일</span>
                  <button className="next" onClick={() => { changeDate({ d: CODE.DATE_DATE, o: 1}); }} ></button>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD001">
              <div className="head">
                <span>시간</span>
                <span>제목</span>
                <span>담당자</span>
              </div>
              <div className="result">
                {(resultList.length == 0 ? (
                    <p className="no_data" key="0">
                      검색된 결과가 없습니다.
                    </p>
                  ) : (
                    resultList.map((item, index) => (
                      <Link key={index} className="list_item" to={{ pathname: URL.INFORM_DAILY_DETAIL }} state={{ schdulId: item.schdulId, prevPath: URL.INFORM_DAILY, }} >
                        <div> {getTimeForm(item.schdulBgnde)} ~ {getTimeForm(item.schdulEndde)} </div>
                        <div className="al">{item.schdulNm}</div>
                        <div>{item.userNm}</div>
                      </Link>
                    ))
                  )
                )}
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

export default DailyList;


