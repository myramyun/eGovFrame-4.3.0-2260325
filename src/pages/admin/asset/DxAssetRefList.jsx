import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavAdmin";
import EgovPaging from "@/components/EgovPaging";

import { itemIdxByPage } from "@/utils/calc";

function DxAssetRefList(props) {
  const location = useLocation();

  // 공통 네비게이션 훅 사용
  const cndRef = useRef();
  const wrdRef = useRef();

  const tyCds = [
    { value: "", label: "선택" },
    { value: "ASSE01", label: "일반자료실" },
    { value: "ASSE02", label: "교육자료실" },
  ];
  const [tyCdCnd, setAssetTyCodeCnd] = useState("0");
  const tyCdLabels = tyCds.filter(opt => opt.label !== "선택" /* "선택"은 제외하고 싶을 때 추가 */).map(opt => opt.label /* ["일반자료실", "교육자료실"] */).join(", "); 

  const [srchCnd, setsrchCnd] = useState(location.state?.srchCnd || { pageIndex: 1, searchCondition: "0", searchKeyword: "" });

  /// 페이지리스트와 페이지네이션
  const [paginationInfo, setPaginationInfo] = useState({});
  const [resultList, setResultList] = useState([]);

  const retrieveList = useCallback(
    (srchCnd) => {
      const retrieveListURL = "/assetRef" + EgovNet.getQueryString(srchCnd);
      const requestOptions = {
        method: "GET",
        headers: { "Content-type": "application/json" },
      };

      EgovNet.requestFetch(
        retrieveListURL,
        requestOptions,
        (resp) => {
          setPaginationInfo(resp.result.paginationInfo);
          setResultList(resp.result.resultList || []); /// 중요: JSX 배열을 만들지 말고, 데이터 배열을 그대로 저장
        },
        (resp) => {
          console.log("/// err response : ", resp);
        },
      );
    },
    [resultList, srchCnd],
  );

  useEffect(() => {
    retrieveList(srchCnd);
  }, []);

  return (
    <div className="container">
      <div className="c_wrap">
        {/* <!-- Location --> */}
        <div className="location">
          <ul>
            <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
            <li> <Link to={URL.ADMIN}>사이트관리</Link> </li>
            <li>자료실관리</li>
          </ul>
        </div>
        {/* <!--// Location --> */}

        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}
          {/* <!-- 본문 --> */}
          <div className="contents ASSET_CREATE_LIST" id="contents">
            <div className="top_tit"> <h1 className="tit_1">사이트관리</h1> </div>
            <h2 className="tit_2">자료실생성관리</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li className="third_1 L">
                  <span className="lb">검색유형선택</span>
                  <label className="f_select" htmlFor="searchCnd">
                    <select
                      id="searchCnd"
                      name="searchCnd"
                      title="검색유형선택"
                      ref={cndRef}
                      onChange={e => { setAssetTyCodeCnd(e.target.value); cndRef.current.value = e.target.value; }}>
                      <option value="0">자료실명</option>
                      <option value="1">자료실유형</option>
                    </select>
                  </label>
                </li>

                <li className="third_2 R">
                  <span className="lb">검색어</span>
                  <span className="f_search w_400">
                    <input
                      type="text"
                      name=""
                      defaultValue={srchCnd && srchCnd.searchKeyword}
                      placeholder={tyCdCnd === "1" ? tyCdLabels : "자료실명을 입력하세요"}
                      ref={wrdRef}
                      onChange={e => { wrdRef.current.value = e.target.value; }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        let searchWrd = wrdRef.current.value;
                        if (tyCdCnd === "1") {
                          const r = tyCds.find(e => e.label === searchWrd);
                          if (r) { searchWrd = r.value; }
                        }
                        retrieveList({ ...srchCnd, pageIndex: 1, searchCondition: cndRef.current.value, searchKeyword: searchWrd, });
                      }}>
                      조회
                    </button>
                  </span>
                </li>
                <li>
                  <Link to={URL.ADMIN_ASSETREF_CREATE} className="btn btn_blue_h46 pd35"> 추가 </Link>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* <!-- 자료실목록 --> */}
            <div className="asset_list BRD006">
              <div className="head">
                <span>번호</span>
                <span>자료실명</span>
                <span>자료실유형</span>
                <span>생성일</span>
                <span>사용</span>
              </div>
              <div className="result">
                {resultList.length === 0 && <p className="no_data">검색된 결과가 없습니다.</p>}
                {resultList.map((item, index) => {
                  const resultCnt = parseInt(paginationInfo.totalRecordCount || 0);
                  const currentPageNo = paginationInfo.currentPageNo || 1;
                  const pageSize = paginationInfo.pageSize || 10;
                  const listIdx = itemIdxByPage(resultCnt, currentPageNo, pageSize, index);

                  return (
                    <Link to={{ pathname: URL.ADMIN_ASSETREF_MODIFY }} state={{ refId: item.refId, searchCondition: srchCnd }} key={listIdx} className="list_item">
                      <div>{listIdx}</div>
                      <div dangerouslySetInnerHTML={{ __html: item.assetNm }}></div>
                      <div>{tyCds.find((e) => e.value === item.assetTyCode)?.label}</div>
                      <div>{item.upDt}</div>
                      <div>{item.useAt === "Y" ? "○" : "✕"}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* <!--// 자료실목록 --> */}

            {/* <!-- Paging --> */}
            <div className="asset_bot">
              <EgovPaging
                pagination={paginationInfo}
                moveToPage={(passedPage) => {
                  retrieveList({ ...srchCnd, pageIndex: passedPage, searchCondition: cndRef.current.value, searchKeyword: wrdRef.current.value });
                }}
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

export default DxAssetRefList;


