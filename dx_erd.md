




Day1 : 요구사항 정의 및 고객팀 요구사항 미팅
Day2 : 시스템 설계 및 역할 분담(ERD 작성, 기술 스택 확정)
Day3 : 시스템 설계(API 설계, 보안 설계), 프로젝트 개시
Day4 : Entity 작성,  RESTful API 기반 백엔드 개발, 배포 환경 구축 및 CI/CD를 이용한 배포
Day5 : RESTful API 기반 백엔드 개발, 외주 작업 시작
Day6 : RESTful API 기반 백엔드 개발,  테스트 코드 작성, 외주 1차 개발 및 피드백 및 수정 작업
Day7 : RESTful API 기반 백엔드 개발, 테스트 코드 작성
Day8 : RESTful API 기반 백엔드 개발, 테스트 코드 작성 및 코드/시스템 사용 가이드 작성 후 외주 작업 전달
Day9 : 개발 마무리 및 통합 테스트 진행, 문서 작업
Day10 : 최종 문서 정리 및 발표



단계,핵심 체크포인트
Day 2-3,"ERD & API 설계: EDU_START_DT, EDU_END_DT 등 날짜 기반 쿼리가 많으므로 인덱스 전략을 미리 구상하세요."
Day 4,CI/CD 구축: eGovFrame 기반 프로젝트라면 Maven/Gradle 빌드 설정과 Docker 환경 호환성을 먼저 확인하는 것이 좋습니다.
Day 5-8,외주 협업: 외주 인력이 API를 즉시 사용할 수 있도록 **Swagger(OpenAPI)**를 연동하여 실시간 명세서를 공유하세요.
Day 9-10,통합 테스트: 대량의 교육생 데이터가 들어올 경우를 대비해 MyBatis의 foreach 등을 활용한 배치 성능을 점검하세요.

CI/CD는 현대적인 소프트웨어 개발 프로세스의 핵심으로, **지속적 통합(Continuous Integration)**과 **지속적 제공/배포(Continuous Delivery/Deployment)**를 의미합니다.



기능명	설명	연관 테이블 및 컬럼
회원 관리	학생과 강사의 회원가입 및 로그인 기능 제공	student, instructor
강의 등록	강사가 새로운 강의 및 강의 자료(동영상, 문서 등)를 업로드할 수 있는 기능	course, lecture, content
강의 수강 신청	학생이 특정 과정을 수강 신청할 수 있는 기능	registration
수강 현황 관리	학생별 수강 신청 현황 및 수강 상태를 확인할 수 있는 기능	registration
퀴즈 생성 및 관리	강사가 퀴즈를 생성하고 문제를 추가할 수 있는 기능	quiz, question, answer
퀴즈 제출	학생이 퀴즈 문제에 대한 답변을 제출할 수 있는 기능	answer
퀴즈 성적 관리	퀴즈 점수를 자동 또는 수동으로 채점하여 성적을 등록할 수 있는 기능	quiz_grade
과제 등록 및 관리	강사가 과제를 생성하고 과제 설명, 제출 기한 등을 설정할 수 있는 기능	assignment
과제 제출	학생이 과제를 제출할 수 있는 기능	submission
과제 성적 평가	강사가 제출된 과제를 평가하고 점수를 등록할 수 있는 기능	assignment_grade
강의 자료 업로드	강사가 강의 자료(파일 등)를 업로드 및 관리할 수 있는 기능	content
강의 시간 및 설명 관리	강의 제목, 강의 설명, 강의 URL 등을 설정 및 삭제할 수 있는 기능	lecture
코스(과정) 관리	강사가 학습 코스를 생성하고 설명 및 시작/종료 일자를 설정 및 수정할 수 있는 기능	course
학생-강의 성적 조회	학생과 강사가 해당 강의 및 퀴즈, 과제 성적을 확인할 수 있는 기능	quiz_grade, assignment_grade
로그 기록 및 시간 관리	데이터 생성 및 수정 시간을 자동으로 기록	created_at, updated_at
수강 상태 변경	수강 신청 상태를 등록, 승인, 취소 등으로 변경할 수 있는 기능	registration