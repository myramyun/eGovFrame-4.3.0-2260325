import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { useDebouncedInput } from "@/hooks/useDebounce";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavAdmin";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";

function DxAssetEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);

  const useAtRadioGroup = [
    { value: "Y", label: "가능" },
    { value: "N", label: "불가능" },
  ];

  const assetTyCodeOptions = [
    { value: "", label: "선택" },
    { value: "ASSE01", label: "일반자료실" },
    { value: "ASSE02", label: "교육자료실" },
  ];

  const refId = location.state?.refId || "";
 
  const [result, setResult] = useState([]);
  const handleInputChange = useDebouncedInput(setResult, 300);

  const [modeInfo, setModeInfo] = useState(() =>
    props.mode === CODE.MODE_CREATE 
    ? { mode: props.mode, modeTitle: "등록", method: "POST", editURL: "/assetRef" } 
    : { mode: props.mode, modeTitle: "수정", method: "PUT", editURL: `/assetRef/${refId}` }
  );

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setResult({ assetNm: '‹식물원›', assetIntrcn: "» 꽃\n· 무궁화\n· 진달래", assetTyCode: "ASSE01", useAt: "Y" }); // MODE_CREATE의 초기값
        break;

      case CODE.MODE_MODIFY:
        retrieveDetail(); // MODE_MODIFY의 초기값
        break;

      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
    

  };

  // MODE_MODIFY의 초기값 요청
  const retrieveDetail = () => {
    console.log("/// retrieveDetail modeInfo.editURL", modeInfo);
    const retrieveDetailURL = modeInfo.editURL;
    const requestOptions = {
      method: "GET",
      headers: { "Content-type": "application/json", },
    };

    EgovNet.requestFetch(
      retrieveDetailURL, 
      requestOptions, 
      (resp) => {
      if (modeInfo.mode === CODE.MODE_MODIFY) { // 수정모드일 경우 조회값 세팅
        setResult(resp.result.vo || []); /// 중요: JSX 배열을 만들지 말고, 데이터 배열을 그대로 저장
      }
    });
  };

  const formObjValidator = (checkRef) => {
    if (checkRef.current[0].value === "") {
      alert("게시판명은 필수 값입니다.");
      return false;
    }
    if (checkRef.current[1].value === "") {
      alert("게시판 소개는 필수 값입니다.");
      return false;
    }
    if (checkRef.current[2].value === "0") {
      alert("첨부파일 가능 숫자는 필수 값입니다.");
      return false;
    }

    return true;
  };

  const updateAsset = () => {
    if (!formObjValidator(checkRef)) { return; } // 양식 필수 데이터 확인

    let  requestOptions = {
      method: modeInfo.method,
      headers: {'Content-Type': 'application/json' }, /// 서버에서도 반드시
      body: JSON.stringify({ ...result }),            /// (JSON)@RequestBody를 사용
    };
    // if (modeInfo.method === "POST") {
      EgovNet.requestFetch(
        modeInfo.editURL, 
        requestOptions, 
        (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            navigate({ pathname: URL.ADMIN_ASSET });
          } else {
            navigate(
              { pathname: URL.ERROR },
              { state: { msg: resp.resultMessage } }
            );
          }
        }
      );
    // } else {
    //   EgovNet.requestFetch(
    //     modeInfo.editURL, 
    //     requestOptions, 
    //     (resp) => {
    //       if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
    //         navigate({ pathname: URL.ADMIN_A });
    //       } else {
    //         navigate(
    //           { pathname: URL.ERROR },
    //           { state: { msg: resp.resultMessage } }
    //         );
    //       }
    //     }
    //   );
    // }
  };

  const deleteAssetArticle = (refId) => {
    const deleteAssetURL = `/assetRef/${refId}`;

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-type": "application/json", },
    };

    EgovNet.requestFetch(
      deleteAssetURL, 
      requestOptions, 
      (resp) => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert("게시글이 사용 중지 되었습니다.");
          navigate(URL.ADMIN_ASSET, { replace: true });
        } else {
          alert("ERR : " + resp.resultMessage);
        }
      },
      (resp) => { console.log("/// err response : ", resp); }
    );
  };

  const getSelectedLabel = (objArray, findLabel = "") => {
    let foundValueLabelObj = objArray.find((o) => o["value"] === findLabel);
    return foundValueLabelObj["label"];
  };

  useEffect(() => { initMode(); }, []);

  return (
    <div className="container">
      <div className="c_wrap">
        {/* <!-- Location --> */}
        <div className="location">
          <ul>
            <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
            <li> <Link to={URL.ADMIN}>사이트관리</Link> </li>
            <li>지료실생성관리</li>
          </ul>
        </div>
        {/* <!--// Location --> */}

        <div className="layout">
          <EgovLeftNav /> {/* <!--// Navigation --> */}

          {/* <!-- 본문 --> */}
          <div className="contents ASSET_CREATE_REG" id="contents">
            <div className="top_tit"> <h1 className="tit_1">사이트관리</h1> </div>
            {modeInfo.mode === CODE.MODE_CREATE && ( <h2 className="tit_2">지료실 생성</h2> )}
            {modeInfo.mode === CODE.MODE_MODIFY && ( <h2 className="tit_2">자료실 수정</h2> )}

            <div className="asset_view2">
              <dl>
                <dt>
                  <label htmlFor="assetNm">자료실명</label>
                  <span className="req">필수</span>
                </dt>
                <dd>
                  <input
                    className="f_input2 w_full" type="text" name="assetNm" title="" id="assetNm" placeholder=""
                    onChange={(e) => setResult({ ...result, assetNm: e.target.value }) }
                    ref={(el) => (checkRef.current[0] = el)}
                    defaultValue={result.assetNm}
                  />
                </dd>
              </dl>
              <dl>
                <dt>
                  <label htmlFor="assetIntrcn">자료실 소개</label>
                  <span className="req">필수</span>
                </dt>
                <dd>
                  <textarea
                    className="f_txtar w_full h_100" name="assetIntrcn" id="assetIntrcn" cols="30" rows="10" placeholder=""
                    onChange={(e) => handleInputChange("assetIntrcn", e.target.value)}
                    ref={(el) => (checkRef.current[1] = el)}
                    defaultValue={result.assetIntrcn}
                  ></textarea>
                </dd>
              </dl>
              <dl>
                <dt>자료실 유형<span className="req">필수</span> </dt>
                <dd>
                  {/* 수정/조회 일때 변경 불가 */}
                  {modeInfo.mode === CODE.MODE_CREATE && (
                    <label className="f_select w_150" htmlFor="assetTyCode">
                      <select id="assetTyCode" name="assetTyCode" title="자료실유형선택"
                        onChange={(e) => setResult({ ...result, assetTyCode: e.target.value, }) }
                        ref={(el) => (checkRef.current[2] = el)}
                        value={result.assetTyCode}
                      >
                        {assetTyCodeOptions.map((option) => {
                          return (
                            <option value={option.value} key={option.value}> {option.label} </option>
                          );
                        })}
                      </select>
                    </label>
                  )}
                  {modeInfo.mode === CODE.MODE_MODIFY && (
                    <span> {result.assetTyCode && getSelectedLabel( assetTyCodeOptions, result.assetTyCode )} </span>
                  )}
                </dd>
              </dl>
              <dl>
                <dt>사용능여부<span className="req">필수</span> </dt>
                <dd>
                  {/* 등록 일때 변경 가능 */}
                  {modeInfo.mode === CODE.MODE_CREATE && (
                    <EgovRadioButtonGroup
                      name="useAt"
                      radioGroup={useAtRadioGroup}
                      setValue={result.useAt}
                      setter={(v) => setResult({ ...result, useAt: v }) }
                    />
                  )}
                  {/* 수정/조회 일때 변경 불가 */}
                  {modeInfo.mode === CODE.MODE_MODIFY && (
                    <span>
                      {result.replyPosblAt && getSelectedLabel( useAtRadioGroup, result.useAt )}
                    </span>
                  )}
                </dd>
              </dl>

              {/* <!-- 버튼영역 --> */}
              <div className="asset_btn_area">
                <div className="left_col btn1">

                  {modeInfo.mode === CODE.MODE_CREATE && (
                    <button className="btn btn_skyblue_h46 w_100" onClick={() => updateAsset()} >
                      저장
                    </button>
                  )}
                  {modeInfo.mode === CODE.MODE_MODIFY && (
                    <>
                      <button className="btn btn_skyblue_h46 w_100" onClick={() => updateAsset()} >
                        수정
                      </button>
          
                      <button className="btn btn_skyblue_h46 w_100" onClick={() => { deleteBoardArticle(result.refId); }} >
                        사용안함
                      </button>
                    </>
                  )}
                </div>

                <div className="right_col btn1">
                  <Link to={URL.ADMIN_ASSET} className="btn btn_blue_h46 w_100">
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

export default DxAssetEdit;
