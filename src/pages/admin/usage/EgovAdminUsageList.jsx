import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavAdmin";
import EgovPaging from "@/components/EgovPaging";

import { itemIdxByPage } from "@/utils/calc";

function EgovAdminUsageList(props) {
  const location = useLocation();

  const cndRef = useRef();
  const wrdRef = useRef();

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      pageIndex: 1,
      searchCnd: "0",
      searchWrd: "",
    }
  ); // 기존 조회에서 접근 했을 시 || 신규로 접근 했을 시

  /// 페이지리스트와 페이지네이션
  const [paginationInfo, setPaginationInfo] = useState({});
  const [resultList, setResultList] = useState([]);

  const retrieveList = useCallback((srchCnd) => {
      const retrieveListURL = "/bbsUseInf" + EgovNet.getQueryString(srchCnd);
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
        (resp) => { console.log("/// err response : ", resp); }
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
            <li>게시판사용관리</li>
          </ul>
        </div>
        {/* <!--// Location --> */}

        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents NOTICE_LIST" id="contents">
            <div className="top_tit"> <h1 className="tit_1">사이트관리</h1> </div>
            <h2 className="tit_2">게시판사용관리</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li className="third_1 L">
                  <label className="f_select" htmlFor="search_select">
                    <select
                      id="search_select"
                      name="searchCnd"
                      title="검색유형선택"
                      ref={cndRef}
                      onChange={(e) => { cndRef.current.value = e.target.value; }}
                    >
                      <option value="0">게시판명</option>
                    </select>
                  </label>
                </li>
                <li className="third_2 R">
                  <span className="f_search w_500">
                    <input
                      type="text"
                      name=""
                      defaultValue={ searchCondition && searchCondition.searchWrd }
                      placeholder=""
                      ref={wrdRef}
                      onChange={(e) => { wrdRef.current.value = e.target.value; }}
                    />
                    <button type="button" onClick={() => { retrieveList({ ...searchCondition, pageIndex: 1, searchCnd: cndRef.current.value, searchWrd: wrdRef.current.value, }); }} >
                      조회
                    </button>
                  </span>
                </li>
                <li>
                  <Link to={URL.ADMIN_USAGE_CREATE} className="btn btn_blue_h46 pd35" >
                    등록
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD009">
              <div className="head">
                <span>번호</span>
                <span>게시판명</span>
                <span>사용 커뮤니티명</span>
                <span>사용 동호회명</span>
                <span>등록일시</span>
                <span>등록</span>
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
                    <Link to={{ pathname: URL.ADMIN_USAGE_MODIFY }} state={{ bbsId: item.bbsId, trgetId: item.trgetId, searchCondition: searchCondition, }} key={listIdx} className="list_item" >
                      <div>{listIdx}</div>
                      <div>{item.bbsNm}</div>
                      <div>{item.cmmntyNm}</div>
                      <div>{item.clbNm}</div>
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

export default EgovAdminUsageList;
