import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";

import { default as TagLeftNav } from "@/components/leftmenu/EgovLeftNavInform";
import EgovAttachFile from "@/components/EgovAttachFile";

function DailyDetail(props) {
  const location = useLocation();

  const [result, setResult] = useState({});
  const [boardAttachFiles, setBoardAttachFiles] = useState();

  const convertDate = (str) => {
    let year = str.substring(0, 4);
    let month = str.substring(4, 6);
    let date = str.substring(6, 8);
    let hour = str.substring(8, 10);
    let minute = str.substring(10, 12);
    
    return {
      year: year,
      month: month,
      date: date,
      hour: hour,
      minute: minute,
      dateForm: year + "년 " + month + "월 " + date + "일 " + hour + "시 " + minute + "분 ",
    };
  };

  const getCodeName = (codeArr, code) => {
    const target = codeArr.find((obj) => obj.code === code?.trim());
    return target ? target.codeNm : "";
  };

  const retrieveDetail = () => {
    const requestURL = `/schedule/${location.state?.schdulId}`;
    const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

    EgovNet.requestFetch(
      requestURL, 
      requestOptions, 
      (resp) => {
        const detail = resp.result.scheduleDetail;
        const result = {
          ...detail, // 기존 데이터 복사
          startDateTime: convertDate(detail.schdulBgnde),
          endDateTime: convertDate(detail.schdulEndde),
          reptitSeCodeNm: getCodeName(resp.result.reptitSeCode, detail.reptitSeCode),
          schdulIpcrCodeNm: getCodeName(resp.result.schdulIpcrCode, detail.schdulIpcrCode),
          schdulSeNm: getCodeName(resp.result.schdulSe, detail.schdulSe)
        };

        setResult(result);
        setBoardAttachFiles(resp.result.resultFiles);
      },
      (resp) => { console.log("/// err response : ", resp); }
    );
  };

  const TagBreadcrumbs = () => (
    <div className="location">
      <ul>
        <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
        <li> <Link to={URL.INFORM}>알림마당</Link> </li>
        <li>일정관리</li>
      </ul>
    </div>
  );

  useEffect(() => {
    // schdulId가 없으면 일정 목록으로 리다이렉트
    if (!location.state?.schdulId) {
      alert("잘못된 접근입니다.");
      window.location.href = URL.INFORM_DAILY;
      return;
    }
    retrieveDetail();
  }, []);

  return (
    <div className="container">
      <div className="c_wrap">
        <TagBreadcrumbs /> {/* <!--// Breadcrumbs --> */}

        <div className="layout">
          <TagLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents SITE_GALLARY_VIEW" id="contents">         
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2">일정관리 상세보기</h2>

            {/* <!-- 게시판 상세보기 --> */}
            <div className="board_view2">
              <dl> <dt>일정구분</dt> <dd>{result.schdulSeNm}</dd> </dl>
              <dl> <dt>중요도</dt> <dd>{result.schdulIpcrCodeNm}</dd> </dl>
              <dl> <dt>부서</dt> <dd>{result.schdulDeptName}</dd> </dl>
              <dl> <dt>일정명</dt> <dd>{result.schdulNm}</dd> </dl>
              <dl> <dt>일정내용</dt> <dd>{result.schdulCn}</dd> </dl>
              <dl> <dt>반복구분</dt> <dd>{result.reptitSeCodeNm}</dd> </dl>
              <dl> <dt>날짜/시간</dt> <dd> {result.startDateTime?.dateForm} ~ {result.endDateTime?.dateForm} </dd> </dl>
              <dl> <dt>담당자</dt> <dd>{result.schdulChargerName}</dd> </dl>
              <EgovAttachFile boardFiles={boardAttachFiles} />

              {/* <!-- 버튼영역 --> */}
              <div className="board_btn_area">
                <div className="right_col btn1">
                  <Link to={location.state?.prevPath} className="btn btn_blue_h46 w_100" >
                    목록
                  </Link>
                </div>
              </div>
              {/* <!--// 버튼영역 --> */}
            </div>
            {/* <!-- 게시판 상세보기 --> */}

          </div>
          {/* <!--// 본문 --> */}

        </div>
      </div>
    </div>
  );
}

export default DailyDetail;


