import { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useListNavigation } from "@/hooks/useListNavigation";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { NOTICE_BBS } from "@/config";

import { default as TagLeftNav } from "@/components/leftmenu/EgovLeftNavInform";
import EgovAttachFile from "@/components/EgovAttachFile";
import bbsFormVaildator from "@/utils/bbsFormVaildator";
import { getSessionItem } from "@/utils/storage";
import { useDebouncedInput } from "@/hooks/useDebounce";

function NoticeEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  /// 게사판
  const bbsId = location.state?.bbsId || NOTICE_BBS.id;
  const nttId = location.state?.nttId || "";
  const searchCondition = location.state?.searchCondition;
  const { getBackToListURL } = useListNavigation(bbsId); // 공통 네비게이션 훅 사용 (목록의 특정 페이지네이션으로 돌아가기 URL 생성용)

  const [board, setBoard] = useState({});
  const [article, setArticle] = useState({ nttSj: "", nttCn: "" });
  const [attachFiles, setAttachFiles] = useState();

  /// 사용자
  const userInfo = getSessionItem("loginUser");
  const userRole = userInfo?.userSe;

  const handleInputChange = useDebouncedInput(setArticle, 300);

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({ ...modeInfo, title: "등록", method: "POST", url: "/board", });
        break;
      case CODE.MODE_MODIFY:
        setModeInfo({ ...modeInfo, title: "수정", method: "PUT", url: `/board/${nttId}`, });
        break;
      case CODE.MODE_REPLY:
        setModeInfo({ ...modeInfo, title: "답글쓰기", method: "POST", url: "/boardReply", });
        break;
      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
    retrieveDetail();
  };

  /// Read
  const retrieveDetail = () => {
    if (modeInfo.mode === CODE.MODE_CREATE) {
      // 등록이면 마스터 정보에서 파일 첨부 가능 여부 조회
      const requestURL = `/boardFileAtch/${bbsId}`;
      const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

      EgovNet.requestFetch(
        requestURL, 
        requestOptions, 
        (resp) => {
        setBoard({ ...resp.result.brdMstrVO, bbsNm: NOTICE_BBS.nm });
      });

      setArticle({ bbsId: bbsId, nttSj: "", nttCn: "" });

    } else { /// CODE.MODE_MODIFY, CODE.MODE_REPLY
      const requestURL = `/board/${bbsId}/${nttId}`;
      const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

      EgovNet.requestFetch(
        requestURL, 
        requestOptions, 
        (resp) => {
          setBoard(resp.result.brdMstrVO);

          if (modeInfo.mode === CODE.MODE_MODIFY) {
            setArticle(resp.result.boardVO);
            setAttachFiles(resp.result.resultFiles);
          } else if (modeInfo.mode === CODE.MODE_REPLY) {
            setArticle({
              ...resp.result.boardVO,
              nttSj: "RE: " + resp.result.boardVO.nttSj, /// 답글모드 "RE: " 추가
              nttCn: "",
              inqireCo: 0,
              atchFileId: "",
            });
          }
        }
      );
    }
  };

  /// Create, Update
  const saveBoard = () => { 
    const formData = new FormData();
    for (let key in article) { formData.append(key, article[key]); }

    if (bbsFormVaildator(formData)) {
      const requestURL = modeInfo.url;
      const requestOptions = { method: modeInfo.method, body: formData, };

      EgovNet.requestFetch(
        requestURL,
        requestOptions, 
        (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            // navigate(URL.INFORM_NOTICE, { state: { bbsId: bbsId } });
            navigate(getBackToListURL(URL.INFORM_NOTICE, searchCondition), { state: { bbsId: bbsId } }); /// 페이징 이동
          } else {
            navigate( { pathname: URL.ERROR }, { state: { msg: resp.resultMessage } } );
          }
        }
      );
    }
  };

  const TagBreadcrumbs = () => (
    <div className="location">
      <ul>
        <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
        <li> <Link to={URL.INFORM}>알림마당</Link> </li>
        <li>{board && board.bbsNm}</li>
      </ul>
    </div>
  );

  useEffect(function () { initMode(); }, []);

  return (
    <div className="container">
      <div className="c_wrap">
        <TagBreadcrumbs />{/* <!--// Breadcrumbs --> */}

        <div className="layout">
          <TagLeftNav />{/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents NOTICE_LIST" id="contents">
            
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2"> {board && board.bbsNm} {modeInfo.title} </h2>

            <div className="board_view2">
              <dl>
                <dt>
                  <label htmlFor="nttSj"> 제목<span className="req">필수</span> </label>
                </dt>
                <dd>
                  <input className="f_input2 w_full" id="nttSj" name="nttSj" type="text"  maxLength="60" 
                    defaultValue={article.nttSj} 
                    onChange={e => setArticle({ ...article, nttSj: e.target.value })}
                  />
                </dd>
              </dl>
              <dl>
                <dt>
                  <label htmlFor="nttCn"> 내용<span className="req">필수</span> </label>
                </dt>
                <dd>
                  <textarea className="f_txtar w_full h_200" id="nttCn" name="nttCn" cols="30" rows="10" placeholder=""
                    defaultValue={article.nttCn}
                    onChange={e => handleInputChange("nttCn", e.target.value)}
                  ></textarea>
                </dd>
              </dl>
              {/* 답글이 아니고 게시판 파일 첨부 가능 상태에서만 첨부파일 컴포넌트 노출 */}
              {modeInfo?.mode !== CODE.MODE_REPLY && board.fileAtchPosblAt === "Y" && (
                <EgovAttachFile
                  fnChangeFile = {(attachfile) => {
                    const arrayConcat = { ...article }; // 기존 단일 파일 업로드에서 다중파일 객체 추가로 변환(아래 for문으로)
                    for (let i = 0; i < attachfile.length; i++) {
                      arrayConcat[`file_${i}`] = attachfile[i];
                    }
                    setArticle(arrayConcat);
                  }}
                  fnDeleteFile = {(deletedFile) => { setAttachFiles(deletedFile); }}
                  boardFiles = {attachFiles}
                  mode = {props.mode}
                  posblAtchFileNumber = {board.posblAtchFileNumber}
                />
              )}

              {/* <!-- 버튼영역 --> */}
              <div className="board_btn_area">
                {userRole === "ADM" && (
                  <div className="left_col btn1">
                    <button className="btn btn_skyblue_h46 w_100" onClick={() => saveBoard()} >
                      저장
                    </button>
                  </div>
                )}

                <div className="right_col btn1">
                  <Link to={URL.INFORM_NOTICE} className="btn btn_blue_h46 w_100" >
                    목록
                  </Link>
                </div>
              </div>
              {/* <!--// 버튼영역 --> */}

            </div>

          </div>
          {/* <!--// 본문 --> */}

        </div>
      </div>
    </div>
  );
}

export default NoticeEdit;


