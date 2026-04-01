import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { useDebouncedInput } from "@/hooks/useDebounce";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavSupport";
import EgovAttachFile from "@/components/EgovAttachFile";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";

import { getSessionItem, setSessionItem } from "@/utils/storage";

import samplePdsListImg from "/assets/images/sample_pds_list.png";
import bbsFormVaildator from "@/utils/bbsFormVaildator";

function DxAssetEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);

  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;

  /// 오늘 날짜를 yyyy-mm-dd hh:mm:ss 형식으로 생성하는 함수
  const getToday = () => { return new Date().toISOString().replace("T", " ").substring(0, 19); };

  const rowid = location.state?.uniqId || ""; /// DB 테이블 특정 Row를 찾기 위한 Key
  const [role, setRole] = useState({ mode: props.mode }); /// 현재 페이지의 권한/모드 (Create, Read, Update, Delete)
 
  const [rule, setRule] = useState({}); /// 입력 상태 조건 (예: 어떤 컬럼이 필수인지, 읽기 전용인지 정의)
  const [result, setResult] = useState([]); /// DB Row 전체 데이터를 담는 객체 (초기값은 빈 객체) | initMode()에서 role에 따라 처리
  const [attachFiles, setAttachFiles] = useState(); /// 첨부파일 정보
  // [{atchFileId : "oO3rGEfD8twsMG5pYVeQOn2gCNJt9eQQfE0/CjOydQ0=", creatDt: "2026-03-19 10:28:29",
  // fileCn: "", fileExtsn: "png", fileMg: "230609", fileSn: "0", fileStreCours: "./files", 
  // orignlFileNm: "스크린샷 2026-03-17 113918.png", streFileNm: "BBS_202603191028294810"}, {...}]

  const udi = useDebouncedInput(setResult, 300); /// 입력 지연(Debounce) 로직 (사용자가 입력을 멈추면 실행)
  
  const retrieveDetail = () => {
    // let retrieveDetailURL = "";
    // if (role.mode === CODE.MODE_CREATE) {  /// 등록이면 초기값 지정
    //   setResult({ proNm: "", wrterNm: "", regDt: "", eduTarget: "", eduLimitCnt: "", atchFileId: "", eduTimeInfo: "", eduOperSysm: "", archiveCn:"", thumbImgPath: "",});
    //   retrieveDetailURL = `/archive/insert`;
    // }
    // 수정이면 초기값 지정 안함
    // if (role.mode === CODE.MODE_MODIFY) { retrieveDetailURL = `/archive/update/${record}`; }
    // const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };
    
    const requestOptions = { method: "GET", headers: { "Content-type": "application/json", }, };
    EgovNet.requestFetch(
      role.editURL,
      requestOptions,
      (resp) => {
        setResult(resp.result.vo || []); /// 중요: JSX 배열을 만들지 말고, 데이터 배열을 그대로 저장
        setAttachFiles(resp.result.resultFiles);
        console.log("/// result", ...result);
      },
      (resp) =>  { console.log("/// err response : ", resp); }
    );
  };

  const updateArchive = () => {
    if (props.mode === CODE.MODE_CREATE) {
      const formData = new FormData();
      // for (let key in archiveDetail) { formData.append(key, archiveDetail[key]); }
      Object.keys(archiveDetail).forEach(e => formData.append(e, archiveDetail[e]));

      formValidator(formData).then((res) => {
        if (res) {
          const requestOptions = { method: role.method, headers: {}, body: formData, };
          EgovNet.requestFetch(
            role.editURL, 
            requestOptions, 
            (resp) => {
              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                alert("자료실이 추가 되었습니다.");
                navigate({ pathname: URL.SUPPORT_ASSET });
              } else {
                navigate(
                  { pathname: URL.ERROR },
                  { state: { msg: resp.resultMessage } }
                );
              }
            }
          );
        }
      });
    } else { /// props.mode === CODE.MODE_MODIFY 

    }
  }

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE: /// 등록이면 초기값 지정 setResult
        setRole({ ...role, modeTitle: "등록", method: "POST", editURL: "/archive/insert", });
        setResult({ proNm: "", wrterNm: "", regDt: "", eduTarget: "", eduLimitCnt: "", atchFileId: "", eduTimeInfo: "", eduOperSysm: "", archiveCn:"", thumbImgPath: "", });
        break;

      case CODE.MODE_MODIFY: /// 수정이면 서버 요청 retrieveDetail();
        setRole({ ...role, modeTitle: "수정", method: "PUT", editURL: `/archive/update/${rowid}`, });
        retrieveDetail();
        break;

      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
  };

  useEffect(() => { initMode(); }, []);

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
          <div className="contents PDS_REG" id="contents">
            <div className="top_tit"> <h1 className="tit_1">고객지원</h1> </div>
            <h2 className="tit_2">자료실 › 등록</h2>
            {/* <h2 className="tit_7">본 화면은 디자인 예시임</h2> */}

            {/* <!-- 상세 --> */}
            <div className="board_view3">
              <div className="tit_edit">
                <dl>
                  <dt> <label htmlFor="writer">프로그램명</label> </dt>
                  <dd>
                    <input
                      className="f_input2 w_full"
                      type="text"
                      // name="progNm"
                      // title=""
                      // id="progNm"
                      placeholder=""
                      defaultValue={result.progNm}
                      onChange={(e) => setResult({ ...result, progNm: e.target.value }) }
                      ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
              </div>

              <div className="info">
                <dl>
                  <dt>작성자</dt>
                  <dd>{sessionUserName}</dd>
                </dl>
                <dl>
                  <dt>작성일</dt>
                  <dd>{getToday()}</dd>
                </dl>
              </div>

              <div className="info2">
                <div className="left_col">
                  <img src={samplePdsListImg} alt="" />
                  <p className="guide">
                    썸네일 이미지는
                    <br />
                    width : 160px, height : 109px
                    <br />
                    크기의 이미지를 올려주세요
                  </p>
                </div>
                <div className="right_col">
                  <dl>
                    <dt>
                      <label htmlFor="ip1">교육 대상</label>
                    </dt>
                    <dd>
                      <input className="f_input2 w_full" type="text" name="eduTarget" title="" id="eduTarget" placeholder=""
                        defaultValue={result.eduTarget}
                        onChange={(e) => setResult({ ...result, eduTarget: e.target.value, }) }
                        ref={(el) => (checkRef.current[0] = el)}
                        required
                      />
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="ip2">모집 정원</label>
                    </dt>
                    <dd>
                      <input className="f_input2 w_full" type="text" name="eduLimitCnt" title="" id="eduLimitCnt" placeholder=""
                        defaultValue={result.eduLimitCnt}
                        onChange={(e) => setResult({ ...result, eduLimitCnt: e.target.value, }) }
                        ref={(el) => (checkRef.current[0] = el)}
                        required
                      />
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="ip5">교육 시간</label>
                    </dt>
                    <dd>
                      <input className="f_input2 w_full" type="text" name="eduTimeInfo" title="" id="eduTimeInfo" placeholder=""
                        defaultValue={result.eduTimeInfo}
                        onChange={(e) => setResult({ ...result, eduTimeInfo: e.target.value, }) }
                        ref={(el) => (checkRef.current[0] = el)}
                        required
                      />
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="ip6">교육 장소</label>
                    </dt>
                    <dd>
                      <input className="f_input2 w_full" type="text" name="eduOperSysm" title="" id="eduOperSysm" placeholder=""
                        defaultValue={result.eduOperSysm}
                        onChange={(e) => setResult({ ...result, eduOperSysm: e.target.value, }) }
                        ref={(el) => (checkRef.current[0] = el)}
                        required
                      />
                    </dd>
                  </dl>
                  {/* 답글이 아니고 게시판 파일 첨부 가능 상태에서만 첨부파일 컴포넌트 노출 */}
                  {/* {role?.mode !== CODE.MODE_REPLY && rule.fileAtchPosblAt === "Y" && ( */}
                  {role?.mode !== CODE.MODE_REPLY && (
                    <EgovAttachFile
                      fnChangeFile={(attachfile) => {
                        const arrayConcat = { ...result }; // 기존 단일 파일 업로드에서 다중파일 객체 추가로 변환(아래 for문으로)
                        for (let i = 0; i < attachfile.length; i++) { arrayConcat[`file_${i}`] = attachfile[i]; }
                        setResult(arrayConcat);
                      }}
                      fnDeleteFile={(deletedFile) => { setAttachFiles(deletedFile); }}
                      boardFiles={attachFiles}
                      mode={props.mode}
                      posblAtchFileNumber={rule.posblAtchFileNumber}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* <!--// 상세 --> */}

            <h3 className="tit_5">
              <label htmlFor="pdsnm">자료설명 입력</label>
            </h3>

            <div className="pds_desc_edit">
              <textarea className="f_txtar w_full" name="" id="pdsnm" cols="30" rows="10" placeholder="" 
                defaultValue={result.archiveCn} 
                onChange={(e) => udi("archiveCn", e.target.value)}
              />
            </div>

            {/* <!-- 버튼영역 --> */}
            <div className="board_btn_area">
              <div className="left_col btn1">
                <>
                  <a href="#!" className="btn btn_skyblue_h46 w_100" onClick={() => { updateArchive(); }} >
                    저장
                  </a>
                  {role.mode === CODE.MODE_MODIFY && (
                    <button className="btn btn_skyblue_h46 w_100" onClick={() => { deleteMember(memberDetail.rowid); }} >
                      삭제
                    </button>
                  )}
                </>
              </div>

              <div className="right_col btn1">
                <Link to={URL.SUPPORT_ASSET} className="btn btn_blue_h46 w_100">
                  목록
                </Link>
              </div>
            </div>
            {/* <!--// 버튼영역 --> */}

            {/* <!--// 본문 --> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DxAssetEdit;