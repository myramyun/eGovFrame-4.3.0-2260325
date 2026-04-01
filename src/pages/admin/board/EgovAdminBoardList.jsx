import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavAdmin";
import EgovPaging from "@/components/EgovPaging";

import { itemIdxByPage } from "@/utils/calc";

function EgovAdminBoardList(props) {
  const location = useLocation();

  // 공통 네비게이션 훅 사용
  const cndRef = useRef();
  const wrdRef = useRef();

  // 기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || { pageIndex: 1, searchCnd: "0", searchWrd: "", }
  ); 

  /// 페이지리스트와 페이지네이션
  const [paginationInfo, setPaginationInfo] = useState({});
  const [resultList, setResultList] = useState([]);

  const retrieveList = useCallback((srchCnd) => {
      const retrieveListURL = "/bbsMaster" + EgovNet.getQueryString(srchCnd);
      const requestOptions = {
        method: "GET",
        headers: { "Content-type": "application/json", },
      };

      EgovNet.requestFetch(
        retrieveListURL,
        requestOptions,
        (resp) => {
          setPaginationInfo(resp.result.paginationInfo);
          setResultList(resp.result.resultList || []); /// 중요: JSX 배열을 만들지 말고, 데이터 배열을 그대로 저장
        },
        (resp) =>  { console.log("/// err response : ", resp); }
      );
    },
    [resultList, searchCondition]
  );

  useEffect(() => { retrieveList(searchCondition); }, []);

  return (
    <div className="container">
      <div className="c_wrap">
        {/* <!-- Location --> */}
        <div className="location">
          <ul>
            <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
            <li> <Link to={URL.ADMIN}>사이트관리</Link> </li>
            <li>게시판생성 관리</li>
          </ul>
        </div>
        {/* <!--// Location --> */}

        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents BOARD_CREATE_LIST" id="contents">
            <div className="top_tit"> <h1 className="tit_1">사이트관리</h1> </div>
            <h2 className="tit_2">게시판생성관리</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li className="third_1 L">
                  <span className="lb">검색유형선택</span>
                  <label className="f_select" htmlFor="searchCnd">
                    <select id="searchCnd" name="searchCnd" title="검색유형선택" ref={cndRef} onChange={(e) => { cndRef.current.value = e.target.value; }} >
                      <option value="0">게시판명</option>
                      <option value="1">게시판유형</option>
                    </select>
                  </label>
                </li>
                <li className="third_2 R">
                  <span className="lb">검색어</span>
                  <span className="f_search w_400">
                    <input
                      type="text"
                      name=""
                      defaultValue={ searchCondition && searchCondition.searchWrd }
                      placeholder=""
                      ref={wrdRef}
                      onChange={(e) => { wrdRef.current.value = e.target.value; }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        retrieveList({
                          ...searchCondition,
                          pageIndex: 1,
                          searchCnd: cndRef.current.value,
                          searchWrd: wrdRef.current.value,
                        });
                      }}
                    >
                      조회
                    </button>
                  </span>
                </li>
                <li>
                  <Link to={URL.ADMIN_BOARD_CREATE} className="btn btn_blue_h46 pd35" >
                    추가
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD006">
              <div className="head">
                <span>번호</span>
                <span>게시판명</span>
                <span>게시판유형</span>
                <span>게시판속성</span>
                <span>생성일</span>
                <span>사용</span>
              </div>
              <div className="result">
              {resultList.length === 0 && (
                <p className="no_data">검색된 결과가 없습니다.</p>
              )}
              {resultList.map((item, index) => {
                const resultCnt = parseInt(paginationInfo.totalRecordCount || 0);
                const currentPageNo = paginationInfo.currentPageNo || 1;
                const pageSize = paginationInfo.pageSize || 10;
                const listIdx = itemIdxByPage(resultCnt, currentPageNo, pageSize, index);

                return (
                  <Link to={{ pathname: URL.ADMIN_BOARD_MODIFY }} state={{ bbsId: item.bbsId, searchCondition: searchCondition, }} key={listIdx} className="list_item" >
                    <div>{listIdx}</div>
                    <div>{item.bbsNm}</div>
                    <div>{item.bbsTyCodeNm}</div>
                    <div>{item.bbsAttrbCodeNm}</div>
                    <div>{item.frstRegisterPnttm}</div>
                    <div>{item.useAt === "Y" ? "○" : "✕"}</div>
                  </Link>
                );
              })}
              </div>
            </div>
            {/* <!--// 게시판목록 --> */}

            {/* <!-- Paging --> */}
            <div className="board_bot">
              <EgovPaging
                pagination={paginationInfo}
                moveToPage={(passedPage) => { retrieveList({ ...searchCondition, pageIndex: passedPage, searchCnd: cndRef.current.value, searchWrd: wrdRef.current.value, }); }}
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

export default EgovAdminBoardList;
