/// j: resp Json data

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavProduct";
import EgovPaging from "@/components/EgovPaging";

function DxExamList(props) {
  const location = useLocation();
 
  const DATE = new Date();
  const FIRST_DAY_OF_THIS_WEEK = new Date(
    DATE.getFullYear(),
    DATE.getMonth(),
    DATE.getDate() - DATE.getDay()
  );

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      year: FIRST_DAY_OF_THIS_WEEK.getFullYear(),
    }
  );

  const [j, setJson] = useState([]); /// j: resp Json data
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 한 페이지에 보여줄 개수

  // 1. EgovPaging 컴포넌트가 요구하는 형태의 가상 paginationInfo 생성
  const paginationInfo = {
    currentPageNo: currentPage,
    recordCountPerPage: itemsPerPage,
    pageSize: 10, // 하단에 한번에 보여줄 페이지 번호 개수 (1~10)
    totalRecordCount: j.length, // 전체 데이터 개수
    totalPageCount: Math.ceil(j.length / itemsPerPage)
  };

  // 2. 현재 페이지에 해당하는 데이터만 추출
  // const slicedList = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   return j.slice(startIndex, startIndex + itemsPerPage);
  // }, [j, currentPage]);


 

  const retrieveList = useCallback((searchCondition) => {
    const retrieveListURL = "/exam/list" + EgovNet.getQueryString(searchCondition);
    const requestOptions = { 
      method: "GET", 
      headers: { "Content-type": "application/json", },
    };

    EgovNet.requestFetch(
      retrieveListURL,
      requestOptions,
      (resp) => { 
        setJson(resp.result.resultList); 
        console.log("/// resultList", resp.result.resultList);
        setCurrentPage(1); // 검색 조건 변경 시 1페이지로 리셋
      }, /// 데이터만 업데이트! UI는 map이 해결!
      (resp) => { console.log("/// err response : ", resp); } 
    );
  }, []); /// 의존성 배열을 넣어주는 것이 좋습니다.

  const changeDate = (target, amount) => {
    let changedDate;

    if (target === CODE.DATE_YEAR) { changedDate = new Date( searchCondition.year + amount, searchCondition.month, searchCondition.date ); }

    setSearchCondition({
      ...searchCondition,
      year: changedDate.getFullYear(),
    });
  };

  const Location = React.memo(() => {
    return (
      <div className="location">
        <ul>
          <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
          <li> <Link to={URL.INFORM}>쇼핑몰</Link> </li>
          <li>테스트</li>
        </ul>
      </div>
    );
  });

  useEffect(() => { retrieveList(searchCondition); }, [searchCondition]);

  return (
    <div className="container">
      <div className="c_wrap">
        <Location />{/* <!--// Location --> */}

        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents WEEK_SCHEDULE" id="contents">
            <div className="top_tit"> <h1 className="tit_1">쇼핑몰</h1> </div>
            <h2 className="tit_2">테스트</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li>
                  <label className="f_select" htmlFor="sel1">
                    <select name="schdulSe" id="sel1" title="조건" value={searchCondition.schdulSe} onChange={e => { setSearchCondition({ ...searchCondition, schdulSe: e.target.value, }); }} >
                      <option value="">전체</option>
                      <option value="1">사학</option>
                      <option value="2">철학</option>
                      <option value="3">수학</option>
                      <option value="4">과학</option>
                    </select>
                  </label>
                </li>
                <li>
                  <button className="prev" onClick={() => { changeDate(CODE.DATE_YEAR, -1); }} ></button>
                  <span>{searchCondition.year}년</span>
                  <button className="next" onClick={() => { changeDate(CODE.DATE_YEAR, 1); }} ></button>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list exams xi">
              <div className="head">
                <span>번호</span>
                <span>제목</span>
                <span>설명</span>
                <span>날짜</span>
                <span>담당자</span>
              </div>
              <div className="result">
              {j.length > 0 ? (
                j.map((e, i) => (
                  <div className="list_item" key={e.idx || i}>
                    <div>{i + 1}</div>
                    <div>
                      <Link to={{ pathname: URL.INFORM_WEEKLY_DETAIL }} state={{ schdulId: e.schdulId, prevPath: URL.INFORM_WEEKLY }} >
                        <span>{e.title}</span>
                        <span>{e.exp}</span>
                        <span>{e.updt}</span>
                        <span>{e.upnm}</span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>데이터가 없습니다.</p> // 데이터가 비었을 때 예외 처리
              )}
              </div>
            </div>
            {/* <!--// 게시판목록 --> */}

            {/* <!-- Paging --> */}
            <div className="board_bot">
              <EgovPaging
                pagination={paginationInfo}
                moveToPage={(passedPage) => { setCurrentPage(passedPage); }}
              />
            </div>
            {/* <!--/ Paging --> */}

          </div>
          {/* <!--// 본문 --> */}
          
        </div>
      </div>
    </div>
  );
}

export default DxExamList;
