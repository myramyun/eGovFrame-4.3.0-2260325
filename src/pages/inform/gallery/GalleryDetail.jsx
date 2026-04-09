import { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useListNavigation } from "@/hooks/useListNavigation";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { GALLERY_BBS } from "@/config";

import { default as TagLeftNav } from "@/components/leftmenu/EgovLeftNavInform";
import EgovAttachFile from "@/components/EgovAttachFile";
import EgovImageGallery from "@/components/EgovImageGallery";
import { getSessionItem } from "@/utils/storage";

function GalleryDetail(props) {
  const navigate = useNavigate();
  const location = useLocation();

  //게시판
  const bbsId = location.state?.bbsId || GALLERY_BBS.id;
  const nttId = location.state?.nttId;
  const searchCondition = location.state?.searchCondition;

  // 공통 네비게이션 훅 사용 (목록으로 돌아가기 URL 생성용)
  const { getBackToListURL } = useListNavigation(bbsId);

  const [board, setBoard] = useState({});
 
  const [article, setArticle] = useState({});
  const [attachFiles, setAttachFiles] = useState();

  /// 사용자
  const [user, setUser] = useState({});
  const userInfo = getSessionItem("loginUser");
  const userKey = userInfo?.uniqId;

  const retrieveDetail = () => {
    const requestURL = `/board/${bbsId}/${nttId}`;
    const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };

    EgovNet.requestFetch(
      requestURL, 
      requestOptions, 
      (resp) => {
        setBoard(resp.result.brdMstrVO);
        setArticle(resp.result.boardVO);
        setUser(resp.result.user);
        setAttachFiles(resp.result.resultFiles);
      }
    );
  };

  const onClickDeleteBoardArticle = (bbsId, nttId, atchFileId) => {
    const requestURL = `/board/${bbsId}/${nttId}`;
    const requestOptions = { method: "PATCH", headers: { "Content-type": "application/json", }, body: JSON.stringify({ atchFileId: atchFileId }), };

    EgovNet.requestFetch(
      requestURL, 
      requestOptions, 
      (resp) => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert("게시글이 삭제되었습니다.");
          navigate(URL.INFORM_GALLERY, { replace: true });
        } else {
          navigate(
            { pathname: URL.ERROR },
            { state: { msg: resp.resultMessage } }
          );
        }
      }
    );
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

  useEffect(function () {
    // nttId가 없으면 갤러리 목록으로 리다이렉트
    if (!nttId) {
      alert("잘못된 접근입니다.");
      navigate(URL.INFORM_GALLERY, { replace: true });
      return;
    }
    retrieveDetail();
  }, []);

  return (
    <div className="container">
      <div className="c_wrap">
        <TagBreadcrumbs />{/* <!--// Breadcrumbs --> */}

        <div className="layout">
          <TagLeftNav />{/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents NOTICE_VIEW" id="contents">
            <div className="top_tit"> <h1 className="tit_1">알림마당</h1> </div>
            <h2 className="tit_2">{board && board.bbsNm}</h2>

            {/* <!-- 게시판 상세보기 --> */}
            <div className="board_view">
              <div className="board_view_top">
                <div className="tit">{article && article.nttSj}</div>
                <div className="info">
                  <dl> <dt>작성자</dt> <dd>{article && article.frstRegisterNm}</dd> </dl>
                  <dl> <dt>작성일</dt> <dd>{article && article.frstRegisterPnttm}</dd> </dl>
                  <dl> <dt>조회수</dt> <dd>{article && article.inqireCo}</dd> </dl>
                </div>
              </div>

              <div className="board_article">
                <textarea name="" cols="30" rows="10" readOnly="readonly" defaultValue={article && article.nttCn} ></textarea>
              </div>

              <EgovImageGallery boardFiles={attachFiles} />

              <div className="board_attach">
                {/* 답글이 아니고 게시판 파일 첨부 가능 상태에서만 첨부파일 컴포넌트 노출 */}
                {article.parnts === "0" &&
                  board.fileAtchPosblAt === "Y" && (
                    <EgovAttachFile boardFiles={attachFiles} />
                  )}
              </div>

              <div className="board_btn_area">
                {user && user.id && board.bbsUseFlag === "Y" && (
                  <div className="left_col btn3">
                    {userKey === article.frstRegisterId && (
                      <>
                        <Link to={{ pathname: URL.INFORM_GALLERY_MODIFY }} state={{ nttId: nttId, bbsId: bbsId, searchCondition: searchCondition }} className="btn btn_skyblue_h46 w_100" >
                        수정
                        </Link>
                        <a href="#!" className="btn btn_skyblue_h46 w_100" onClick={e => { e.preventDefault(); onClickDeleteBoardArticle( article.bbsId, article.nttId, article.atchFileId ); }} >
                          삭제
                        </a>
                      </>
                    )}
                    {board.replyPosblAt === "Y" && (
                      <Link to={{ pathname: URL.INFORM_GALLERY_REPLY }} state={{ nttId: nttId, bbsId: bbsId, }} className="btn btn_skyblue_h46 w_100" >
                        답글작성
                      </Link>
                    )}
                  </div>
                )}

                <div className="right_col btn1">
                  <Link to={getBackToListURL(URL.INFORM_GALLERY, searchCondition)} className="btn btn_blue_h46 w_100" >
                    목록
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- 게시판 상세보기 --> */}

            {/* <!--// 본문 --> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryDetail;


