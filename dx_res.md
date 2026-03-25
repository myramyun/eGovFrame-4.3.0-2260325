# boot ``` ```

## 강제 에라 위치 추적
if (true) { throw new RuntimeException("/// This is the End"); }

## 로그
System.out.println("Key: " + key + ", Value: " + value);





# DB ``` ```

## 객체별 명명 규칙 (Prefix)
| 접두어 | 풀이 (Full Name) | 주요 용도 및 설명 | 예시 객체명 |
| :--- | :--- | :--- | :--- |
| **TN** | **T**able **N**ormal | **일반 데이터 테이블**. 실제 업무 데이터가 저장되는 핵심 테이블 | `COMTNBOARD` |
| **TC** | **T**able **C**ode | **코드 테이블**. 공통 코드, 분류용 데이터를 관리하는 테이블 | `COMTCCMMNCODE` |
| **TH** | **T**able **H**istory | **이력 테이블**. 데이터 변경 이력이나 접속 로그를 기록하는 테이블 | `COMTHLOGINLOG` |
| **TS** | **T**able **S**tatistics | **통계 테이블**. 집계된 수치 데이터나 통계 결과값을 저장하는 테이블 | `COMTSBBSSTAT` |
| **TM** | **T**able **M**etadata | **메타데이터 테이블**. 시스템 설정이나 인터페이스 정의용 테이블 | `COMTMIFINFO` |
| **VN** | **V**iew **N**ormal | **가상 뷰(View)**. 조회 성능이나 편의를 위해 논리적으로 결합된 객체 | `COMVNBBSLIST` |
| **SN** | **S**equence **N**umber | **시퀀스(Sequence)**. 고유 번호를 자동 생성하기 위한 객체 | `COMSNBOARD_ID` |






# react ``` ```

/// pagination
if (commandMap.get("pageIndex") != null && !commandMap.get("pageIndex").equals("")) {
  ___VO.setPageIndex(Integer.parseInt(String.valueOf(commandMap.get("pageIndex"))));
} else {
  ___VO.setPageIndex(1);
}


/// session
import { getSessionItem, setSessionItem } from "@/utils/storage";


const sessionUser = getSessionItem("loginUser");
const sessionUserId = sessionUser?.id;
const sessionUserName = sessionUser?.name;
const sessionUserSe = sessionUser?.userSe;


/// 클라이언트 오늘 날짜를 yyyy-mm-dd hh:mm:ss 형식으로 생성하는 함수
const getToday = () => { return new Date().toISOString().replace("T", " ").substring(0, 19); };

/// requestFetch
EgovNet.requestFetch(
  retrieveDetailURL, 
  requestOptions, 
  (resp) => {
    setResult(resp.result.vo || []); /// 중요: JSX 배열을 만들지 말고, 데이터 배열을 그대로 저장
  },
  (resp) =>  { console.log("/// err response : ", resp); }
);





# etc ``` ```

## 특수기호
✕●○ ‹› · »







