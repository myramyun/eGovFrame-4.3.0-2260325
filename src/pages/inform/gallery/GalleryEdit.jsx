import { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useListNavigation } from "@/hooks/useListNavigation";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { GALLERY_BBS } from "@/config";

import { default as TagLeftNav } from "@/components/leftmenu/EgovLeftNavInform";
import EgovAttachFile from "@/components/EgovAttachFile";
import bbsFormVaildator from "@/utils/bbsFormVaildator";
import { getSessionItem } from "@/utils/storage";
import { useDebouncedInput } from "@/hooks/useDebounce";

function GalleryEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  // const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [role, setRole] = useState({ mode: props.mode }); /// 현재 페이지의 권한/모드 (Create, Read, Update, Delete)
 
  /// 게시판
  const bbsId = location.state?.bbsId || GALLERY_BBS.id;
  const nttId = location.state?.nttId || "";
  const searchCondition = location.state?.searchCondition;

  // 공통 네비게이션 훅 사용 (목록으로 돌아가기 URL 생성용)
  const { getBackToListURL } = useListNavigation(bbsId);

  const [board, setBoard] = useState({});
  const [article, setArticle] = useState({ nttSj: "", nttCn: "" });
  const [attachFiles, setAttachFiles] = useState();

  /// 사용자
  const sessionUser = getSessionItem("loginUser");
  const sessionUniqId = sessionUser?.uniqId;

  const handleInputChange = useDebouncedInput(setArticle, 300);

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setRole({ ...role, title: "등록", method: "POST", url: "/board", });
        break;
      case CODE.MODE_MODIFY:
        setRole({ ...role, title: "수정", method: "PUT", url: `/board/${nttId}`, });
        break;
      case CODE.MODE_REPLY:
        setRole({ ...role, title: "답글쓰기", method: "POST", url: "/boardReply", });
        break;
      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
    retrieveDetail();
  };

  /// Read
  const retrieveDetail = () => {
    if (role.mode === CODE.MODE_CREATE) {
      // 등록이면 마스터 정보에서 파일 첨부 가능 여부 조회
      const requestURL = `/boardFileAtch/${bbsId}`;
      const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

      EgovNet.requestFetch(
        requestURL,
        requestOptions,
        (resp) => {
        setBoard({ ...resp.result.brdMstrVO, bbsNm: GALLERY_BBS.nm });
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

          if (role.mode === CODE.MODE_MODIFY) {
            setArticle(resp.result.boardVO);
            setAttachFiles(resp.result.resultFiles);
          } else if (role.mode === CODE.MODE_REPLY) {
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
  const saveArticle = () => {
    const formData = new FormData();
    for (let key in article) { formData.append(key, article[key]); }

    if (bbsFormVaildator(formData)) {
      const requestURL = role.url;
      const requestOptions = { method: role.method, body: formData, };

      EgovNet.requestFetch(
        requestURL, 
        requestOptions, 
        (resp) => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          // navigate(URL.INFORM_GALLERY, { state: { bbsId: bbsId },  });
          navigate(getBackToListURL(URL.INFORM_GALLERY, searchCondition), { state: { bbsId: bbsId }}); /// 페이징 이동
        } else {
          navigate( { pathname: URL.ERROR }, { state: { msg: resp.resultMessage } } );
        }
      });
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
        <TagBreadcrumbs /> {/* <!--// Breadcrumbs --> */}

        <div className="layout">
          <TagLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents SITE_GALLARY_VIEW" id="contents">
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2"> {board && board.bbsNm} {role.title} </h2>

            <div className="board_view2">
              <dl>
                <dt>
                  <label htmlFor="nttSj">
                    제목<span className="req">필수</span>
                  </label>
                </dt>
                <dd>
                  <input className="f_input2 w_full" id="nttSj" name="nttSj" type="text" maxLength="60"
                    defaultValue={article.nttSj}
                    onChange={e => setArticle({ ...article, nttSj: e.target.value }) }
                  />
                </dd>
              </dl>
              <dl>
                <dt>
                  <label htmlFor="nttCn">
                    내용<span className="req">필수</span>
                  </label>
                </dt>
                <dd>
                  <textarea className="f_txtar w_full h_200" id="nttCn" name="nttCn" cols="30" rows="10" placeholder=""
                    defaultValue={article.nttCn}
                    onChange={e => handleInputChange("nttCn", e.target.value)}
                  ></textarea>
                </dd>
              </dl>
              {/* 답글이 아니고 게시판 파일 첨부 가능 상태에서만 첨부파일 컴포넌트 노출 */}
              {role?.mode !== CODE.MODE_REPLY && board.fileAtchPosblAt === "Y" && (
                <EgovAttachFile
                  fnChangeFile = {(attachfile) => {
                    const arrayConcat = { ...article }; // 기존 단일 파일 업로드에서 다중파일 객체 추가로 변환(아래 for문으로)
                    console.log( "/// article", article);
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
                {sessionUniqId && (
                  <div className="left_col btn1">
                    <a href="#!" className="btn btn_skyblue_h46 w_100" onClick={() => { saveArticle(); }} >
                      저장
                    </a>
                  </div>
                )}

                <div className="right_col btn1">
                  { searchCondition ? (
                    <Link to={getBackToListURL(URL.INFORM_GALLERY, searchCondition)} className="btn btn_blue_h46 w_100" >
                      목록
                    </Link>
                  ) : (
                    <a href={URL.INFORM_GALLERY} className="btn btn_blue_h46 w_100" >
                      목록
                    </a>
                  )}
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

export default GalleryEdit;


