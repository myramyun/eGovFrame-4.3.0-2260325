import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavSupport";
import EgovPaging from "@/components/EgovPaging";

import { itemIdxByPage } from "@/utils/calc";

import samplePdsListImg from "/assets/images/sample_pds_list.png";

function EgovDownloadList() {
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
            <li> <Link to="" className="home"> Home </Link> </li>
            <li> <Link to="">고객지원</Link> </li>
            <li>자료실</li>
          </ul>
        </div>
        {/* <!--// Location --> */}

        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents PDS_LIST" id="contents">
            <div className="top_tit"> <h1 className="tit_1">고객지원</h1> </div>
            <h2 className="tit_2">자료실</h2>
            {/* <h2 className="tit_7">본 화면은 디자인 예시임</h2> */}

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li className="third_1 L">
                  <label className="f_select" htmlFor="search_select">
                    <select defaultValue={"0"} name="search_select" id="search_select" >
                      <option value="0">전체</option>
                      <option value="1">제목</option>
                      <option value="2">제목/내용</option>
                      <option value="3">작성자</option>
                    </select>
                  </label>
                </li>
                <li className="third_2 R">
                  <span className="f_search w_500">
                    <input type="text" name="" placeholder="" />
                    <button type="button">조회</button>
                  </span>
                </li>
                <li>
                  <Link to={URL.SUPPORT_DOWNLOAD_CREATE} className="btn btn_blue_h46 pd35" >
                    등록
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            <h3 className="tit_5">추천 다운로드 자료</h3>

            {/* <!-- 추천 --> */}
            <div className="pdslist">
              <ul>
                <li>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    <img src={samplePdsListImg} alt="" />
                    <span>
                      <strong>egovframe installer v1.03</strong>
                      <span>
                        egovframe의 템플릿 설치를 도와주는
                        인스톨러.....egovframe의 템플릿 설치를 도와주는 인스톨러
                      </span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    <img src={samplePdsListImg} alt="" />
                    <span>
                      <strong>egovframe installer v1.03</strong>
                      <span>
                        egovframe의 템플릿 설치를 도와주는
                        인스톨러.....egovframe의 템플릿 설치를 도와주는 인스톨러
                      </span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    <img src={samplePdsListImg} alt="" />
                    <span>
                      <strong>egovframe installer v1.03</strong>
                      <span>
                        egovframe의 템플릿 설치를 도와주는
                        인스톨러.....egovframe의 템플릿 설치를 도와주는 인스톨러
                      </span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    <img src={samplePdsListImg} alt="" />
                    <span>
                      <strong>egovframe installer v1.03</strong>
                      <span>
                        egovframe의 템플릿 설치를 도와주는
                        인스톨러.....egovframe의 템플릿 설치를 도와주는 인스톨러
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--// 추천 --> */}

            <h3 className="tit_5">최신 등록 자료</h3>

            {/* <!-- 최신 --> */}
            <div className="recent">
              <ul className="left_col">
                <li>
                  <span className="no">1</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    2021년도 표준프레임워크 기술지원 안내
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">2</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    2021년도 표준프레임워크 기술지원 안내
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">3</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    2021년도 표준프레임워크 기술지원 안내
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">4</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    2021년도 표준프레임워크 기술지원 안내
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">5</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    2021년도 표준프레임워크 기술지원 안내
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
              </ul>

              <ul className="right_col">
                <li>
                  <span className="no">6</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    egovframework online installer v1.03
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">7</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    egovframework online installer v1.03
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">8</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    egovframework online installer v1.03
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">9</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    egovframework online installer v1.03
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
                <li>
                  <span className="no">10</span>
                  <Link to={URL.SUPPORT_DOWNLOAD_DETAIL}>
                    egovframework online installer v1.03
                  </Link>
                  <span className="ymd">2021-08-05</span>
                </li>
              </ul>
            </div>
            {/* <!--// 최신 --> */}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD007">
              <div className="head">
                <span>번호</span>
                <span>소프트웨어명</span>
                <span>다운</span>
                <span>크기</span>
                <span>등록일</span>
              </div>
              <div className="result">
                {/* <!-- case : 데이터 없을때 --> */}
                {/* <p className="no_data" key="0">검색된 결과가 없습니다.</p> */}

                {/* <!-- case : 데이터 있을때 --> */}
                <Link to={URL.SUPPORT_DOWNLOAD_DETAIL} className="list_item">
                  <div>3</div>
                  <div className="al">
                    전자정부표준프레임워크 인스톨러(Egovframework installer)
                    V1.037
                  </div>
                  <div>100</div>
                  <div>16Mb</div>
                  <div>2021-7-24</div>
                </Link>
                <Link to={URL.SUPPORT_DOWNLOAD_DETAIL} className="list_item">
                  <div>2</div>
                  <div className="al">
                    전자정부표준프레임워크 인스톨러(Egovframework installer)
                    V1.037
                  </div>
                  <div>100</div>
                  <div>16Mb</div>
                  <div>2021-7-24</div>
                </Link>
                <Link to={URL.SUPPORT_DOWNLOAD_DETAIL} className="list_item">
                  <div>1</div>
                  <div className="al">
                    전자정부표준프레임워크 인스톨러(Egovframework installer)
                    V1.037
                  </div>
                  <div>100</div>
                  <div>16Mb</div>
                  <div>2021-7-24</div>
                </Link>
              </div>
            </div>
            {/* <!--// 게시판목록 --> */}

            {/* <!-- Paging --> */}
            <div className="board_bot">
              <div className="paging">
                <ul>
                  <li className="btn">
                    <button to="#" className="first">
                      처음
                    </button>
                  </li>
                  <li className="btn">
                    <button to="#" className="prev">
                      이전
                    </button>
                  </li>
                  <li>
                    <button to="#" className="cur">
                      1
                    </button>
                  </li>
                  <li>
                    <button to="#">2</button>
                  </li>
                  <li>
                    <button to="#">3</button>
                  </li>
                  <li>
                    <button to="#">4</button>
                  </li>
                  <li>
                    <button to="#">5</button>
                  </li>
                  <li className="btn">
                    <button to="#" className="next">
                      다음
                    </button>
                  </li>
                  <li className="btn">
                    <button to="#" className="last">
                      마지막
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/* <!--// Paging --> */}

            {/* <!-- button area --> */}
            <div className="board_btn_area">
              <div className="left_col btn1"></div>

              <div className="right_col btn1">
                <Link to={URL.SUPPORT_DOWNLOAD_CREATE} className="btn btn_upload" >
                  <span>자료 올리기</span>
                </Link>
              </div>
            </div>
            {/* <!--// button area --> */}

          </div>
          {/* <!--// 본문 --> */}
        </div>
      </div>
    </div>
  );
}

export default EgovDownloadList;


