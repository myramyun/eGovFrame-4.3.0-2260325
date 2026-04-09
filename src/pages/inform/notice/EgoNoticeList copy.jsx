import { memo, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useListNavigation } from "@/hooks/useListNavigation";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { NOTICE_BBS } from "@/config";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavInform";
import EgovPaging from "@/components/EgovPaging";

import { itemIdxByPage } from "@/utils/calc";
import { getSessionItem } from "@/utils/storage";

function EgovNoticeList(props) {
  /// 게시판
  const bbsId = NOTICE_BBS.id;
  const cndRef = useRef(); /// 검색조건 네비게이션 훅 사용
  const wrdRef = useRef(); /// 입력검색 네비게이션 훅 사용

  const [board, setBoard] = useState({});
  const [article, setArticle] = useState([]);
  const { searchCondition, handlePageMove, handleSearch } = useListNavigation(bbsId);
  const [paginationInfo, setPaginationInfo] = useState({});

  /// 사용자
  const [user, setUser] = useState({});
  const userInfo = getSessionItem("loginUser");
  const userRole = userInfo?.userSe;

  /// searchCondition {bbsId: 'BBSMSTR_AAAAAAAAAAAA', pageIndex: 1, searchCnd: '0', searchWrd: ''}
  const retrieveList = useCallback((searchCondition) => {
    const requestURL = "/board" + EgovNet.getQueryString(searchCondition);
    const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

    EgovNet.requestFetch(
      requestURL,
      requestOptions,
      (resp) => {
        setBoard(resp.result.brdMstrVO);
        setUser(resp.result.user);

        setPaginationInfo(resp.result.paginationInfo);
        setArticle(resp.result.resultList || []); /// 중요: JSX 배열을 만들지 말고, 데이터 배열을 그대로 저장
      },
      function (resp) {
        console.log("/// err response : ", resp);
      }
    );
  }, []);

  const TagBreadcrumbs = memo(() => {
    return (
      <div className="location">
        <ul>
          <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
          <li> <Link to={URL.INFORM}>알림마당</Link> </li>
          <li>{board && board.bbsNm}</li>
        </ul>
      </div>
    );
  });

  useEffect(() => { retrieveList(searchCondition); }, [searchCondition]);

  return (
    <div className="container">
      <div className="c_wrap">
        <TagBreadcrumbs />{/* <!--// Breadcrumbs --> */}
       
        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents NOTICE_LIST" id="contents">
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2">{board && board.bbsNm}</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li className="third_1 L">
                  <label className="f_select" htmlFor="sel1">
                    <select id="sel1" title="조건" defaultValue={searchCondition.searchCnd} ref={cndRef} onChange={e => { cndRef.current.value = e.target.value; }} >
                      <option value="0">제목</option>
                      <option value="1">내용</option>
                      <option value="2">작성자</option>
                    </select>
                  </label>
                </li>
                <li className="third_2 R">
                  <span className="f_search w_500">
                    <input type="text" name="" defaultValue={searchCondition.searchWrd} placeholder="" ref={wrdRef} onChange={e => { wrdRef.current.value = e.target.value; }} />
                    <button type="button" onClick={() => { handleSearch(cndRef, wrdRef, retrieveList); }} >
                      조회
                    </button>
                  </span>
                </li>
                {/* user.id 대신 권한그룹 세션값 사용 */}
                {user && userRole === "ADM" && board.bbsUseFlag === "Y" && (
                  <li>
                    <Link to={URL.INFORM_NOTICE_CREATE} state={{ bbsId: bbsId }} className="btn btn_blue_h46 pd35" >
                      등록
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD002">
              <div className="head">
                <span>번호</span>
                <span>제목</span>
                <span>작성자</span>
                <span>작성일</span>
                <span>조회수</span>
              </div>
              <div className="result">
                {article.length === 0 && (
                  <p className="no_data">검색된 결과가 없습니다.</p>
                )}
                {article.map((item, index) => {
                  const resultCnt = parseInt(paginationInfo.totalRecordCount || 0);
                  const currentPageNo = paginationInfo.currentPageNo || 1;
                  const pageSize = paginationInfo.pageSize || 10;
                  const listIdx = itemIdxByPage(resultCnt, currentPageNo, pageSize, index);

                  return (
                    <Link to={{ pathname: URL.INFORM_NOTICE_DETAIL }} state={{ nttId: item.nttId, bbsId: item.bbsId, searchCondition: searchCondition }} key={item.nttId} className="list_item" >
                      <div>{listIdx}</div>
                      <div className={`al ${item.replyLc * 1 ? 'reply' : ''}`}>{item.nttSj}</div>
                      <div>{item.frstRegisterNm}</div>
                      <div>{item.frstRegisterPnttm}</div>
                      <div>{item.inqireCo}</div>
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
                moveToPage={(passedPage) => { handlePageMove(passedPage, cndRef, wrdRef, retrieveList); }}
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

export default EgovNoticeList;

