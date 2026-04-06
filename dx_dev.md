# 260406
헨젤과 그레텔이 길을 잃지 않으려고 남긴 '빵부스러기' Breadcrumbs
const Breadcrumbs = memo(() => {
    return (
      <div className="location">
        <ul>
          <li> <Link to={URL.MAIN} className="home"> Home </Link> </li>
          <li> <Link to={URL.INFORM}>알림마당</Link> </li>
          <li>{masterBoard && masterBoard.bbsNm}</li>
        </ul>
      </div>
    )
  })




# 260331
스위퍼 기능 설치, 스위퍼 배너 dxcomp/CpBanner에 추가
``` npm install swiper ```



# 260330
Egov 4.3.1 2025-05-12


리액트부터 DB
1. React (요청)
행위: axios.get('/api/users/1') 또는 axios.post('/api/users', data) 호출.
역할: 사용자의 액션을 HTTP 메서드(GET, POST 등)에 담아 서버로 보냅니다.

2. Swagger 어노테이션 (대문과 안내판) [전자정부_폴더_src/main/java] 
행위: 자바 컨트롤러 위에 작성된 @Operation, @Schema 같은 어노테이션이 작동합니다.
역할: 리액트에서 보낸 데이터가 **서버가 약속한 형식(스키마)**에 맞는지 1차적으로 확인합니다. 동시에 개발자에게는 "이 API는 이런 데이터를 주고받아야 해"라는 명세서를 보여줍니다.

3. Java(Service) DTO/Entity (데이터의 규격, 즉 '스키마')  ~DAO.java /~VO.java
행위: 리액트가 보낸 JSON 데이터를 자바 객체(DTO)로 변환(매핑)합니다.
역할: 자바 프로그램 내부에서 데이터를 안전하게 다루기 위한 데이터 틀(Schema) 역할을 합니다. 여기서 데이터 유효성 검사(값이 비어있는지 등)를 수행합니다.

4. MyBatis XML (쿼리 실행기) [전자정부_폴더_src/main/resource]
행위: 자바 객체에 담긴 값을 SQL 파라미터로 넘겨 XML에 정의된 쿼리를 실행합니다. 예: <select id="getUser"> SELECT * FROM users WHERE id = #{id} </select>
역할: 자바의 언어를 **DB의 언어(SQL)**로 번역하여 실제 데이터를 요청합니다.

5. MySQL DB (데이터의 원천)
행위: 쿼리에 맞는 데이터를 찾아 자바에게 돌려줍니다.
역할: 가장 물리적인 형태의 테이블 스키마에 따라 저장된 데이터를 관리합니다.





상황추천 방식이유첨부파일이 있는 등록/수정방법 
A (Multipart)전자정부프레임워크의 EgovFileMngUtil 등 공통 컴포넌트와 결합도가 가장 좋아 개발 속도가 빠릅니다.파일 없이 텍스트/숫자만 저장방법 
B (JSON)@RequestBody를 사용하면 객체 변환이 깔끔하고, 불필요한 HTTP 오버헤드가 적어 성능상 유리합니다.모바일 앱과 통신하는 API방법 
B (JSON)모바일 환경에서는 데이터 사용량을 최소화하는 JSON 방식이 표준입니다.


# REACT 개발 정보 [///_REACT_개발_정보]  

## 메뉴 수정
1. src/contants/url.jsx, src/contants/url.js 추가
2. src/routes/index.jsx 추가
3. src/componets/leftment/...LeftNav...jsx 해당 페이지에 추가
4. src/componets/EgovHeader.jsx 추가
[사용안함] src/componets/EgovLeftNav.jsx

## 게시판 추가 
1. ADMIN 로그인
2. 게시판생성관리 > 생성
3. 게시판사용관리 > 사용 추가
4. 해당 페이지 생성

### 행사 게시판 (오늘의 행사) 



### 일반 게시판 (공지사항) 



# SPRING BOOT 개발 정보 [///_SPRING_BOOT_개발_정보]  

- serialVersionUID 생성
@Schema(description = "에셋 속성 정보 엔티티")
@Getter
@Setter
public class DxAssetRef implements Serializable {

    /**
	 * serialVersion UID
	 */
	private static final long serialVersionUID = -2968843401686381599L;

private static final long serialVersionUID = -2968843401686381599L; 없는 상태에서 
DxAssetRef에 노란 경고 줄이 나타나면 마우스를 올리면 창에
"Add generated serial version ID" 클릭, 자동 생성

- parameterType, resultType

1. parameterType (데이터 가공을 위한 조건)
쿼리를 실행하기 위해 **"외부(Java)에서 안(SQL)으로 던져주는 데이터"**의 타입입니다.
역할: WHERE 절에서 조건을 걸거나, INSERT 할 때 실제 값을 채우는 용도입니다.
비유: "이번에 찾을 시험 번호는 10번이야(Integer)", "검색어는 기말고사야(String)" 처럼 조건을 전달하는 바구니입니다.
사용 예: #{idx}, #{searchKeyword} 등 SQL 문 안에서 변수로 쓰이는 값들의 원천입니다.

parameterType="comDefaultVO" 게시판 페이징, 조건 검색을 위한 Egov 프레임워이지만
Application Level Paging이므로 메모리 손실이 크다.
반득시, 
``` ```
FROM DX_EXAM_TN 
LIMIT #{recordCountPerPage} OFFSET #{firstIndex}
``` ```
리미트와 오프셋을 명시하고 값은 comDefaultVO에서 참조

parameterType="java.util.Map" 단순 구조


2. resultType (결과 데이터의 규격)
쿼리 실행이 끝난 후 **"DB에서 나온 데이터를 어떤 모양으로 담을 것인가"**에 대한 규칙입니다.
역할: DB 테이블의 행(Row) 정보를 자바가 읽을 수 있는 객체(VO, Map 등)로 변환합니다.
비유: "나온 결과물들을 examVO라는 상자에 예쁘게 담아줘", "아니면 그냥 egovMap이라는 봉투에 담아줘"라고 명령하는 것입니다.
특징: 이 설정이 있어야만 리액트 콘솔에서 보셨던 {idx: 2, title: '...'} 같은 데이터를 우리가 사용할 수 있게 됩니다.

<select id="selectIndvdlExamManageRetrieve" parameterType="java.util.Map" resultType="egovMap">
resultType="egovMap" 는 USER_ID -> userId로 보냄, 주로 전체 조회

<select id="selectIndvdlExamManageDetailVO" resultMap="IndvdlExamManage">
resultMap="IndvdlExamManage" <resultMap></resultMap>에 지정힌 대로


## DB 모듈 
- 스키마 등록
src/main/java/egovFramework/com/config OpenApiConfig.java

Schema<?> examMap = new Schema<Map<String, String>>()
				.addProperty("total", new StringSchema().example(""))
				.addProperty("year", new StringSchema().example("2023"));

example에 숫자는 "2023"는 기능 없는 예시

- 스프링 컨테이너(관리소)에 등록
src/main/java/egovFramework/com/config EgovConfigAppGen.java

자바에서는 new EgovTableIdGnrServiceImpl()처럼 직접 객체를 생성해서 써야 합니다. 하지만 @Bean을 붙이면 스프링이 메서드를 직접 실행해서 객체를 생성합니다.

/** 시험목록 ID Generation Config
  * @return
  */
@Bean(destroyMethod = "destroy")
public EgovTableIdGnrServiceImpl deptExamManageIdGnrService() {
  return new EgovIdGnrBuilder().setDataSource(dataSource).setEgovIdGnrStrategyImpl(new EgovIdGnrStrategyImpl())
    .setBlockSize(10)
    .setTable("IDS")
    .setTableName("EXAM_ID")
    .setPreFix("EXAM_")
    .setCipers(13)
    .setFillChar('0')
    .build();
}
	
- Mapper 추가
src/main/resources/egovframework/mapper/let/exam DxIndvdlExamManage_SQL_mysql.xml 


## 자동 고유 아이디 생성
IDS 테이블을 참조
src/main/java/egovframework/com/config/EgovConfigAppIdGen.java

~serviceImpl.java 에서 추가
@Resource(name="dxAssetIdGnr") /// 유니크 아이디 자동 생성 ASSET_0000000000000, IDS 테이블 카운트 
	private EgovIdGnrService idGnr;

String sMakeId = idGnr.getNextStringId();
		VO.setRefId(sMakeId);



# MYSQL 개발 정보 [///_MYSQL_개발_정보] 

## DB DATETIME 포맷 
-- DBeaver 생성
CREATE TABLE sht.DX_EXAM (
  UPDT   DATETIME,              								-- 수정 시점
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO sht.DX_EXAM (UPDT) VALUES ( CURRENT_TIMESTAMP )

- Mapper xml
SELECT DATE_FORMAT(sysdate(),'%Y-%m-%d') UPDT FROM DX_EXAM 

UPDATE DX_EXAM SET UPDT = sysdate() FROM DX_EXAM WHERE IDX = #{examId}

INSERT INTO DX_EXAM ( UPDT ) VALUES( sysdate() )



## SQL 문법 순서
SQL의 순서는 반드시 SELECT → FROM → WHERE → ORDER BY → LIMIT 순이어야 합니다.

<select id="selectAssetRef" parameterType="java.util.Map" resultType="egovMap">
    SELECT 
        REF_ID, 
        ASSET_NM,
        ASSET_INTRCN, 
        ASSET_TY_CODE,
        USE_AT, 
        USE_CNT, 
        UP_ID, 
        DATE_FORMAT(SYSDATE(), '%Y-%m-%d') AS UP_DT
    FROM DX_ASSET_REF_TN
      <where>
        <if test="refId != null and refId != ''">
            AND REF_ID = #{refId}
        </if>
    </where>
            
    <if test="refId == null or refId == ''">
        ORDER BY NTT_ID DESC
        LIMIT #{recordCountPerPage} OFFSET #{firstIndex}
    </if>
</select>



## parameterType
<select id="selectAssetRef" parameterType="java.util.Map" resultType="egovMap">
<select id="selectAssetRefVO" parameterType="comDefaultVO" resultType="egovMap">
<select id="selectAssetRefVO" parameterType="DxAssetManageVO" resultType="egovMap">

- DxAssetManageVO는 comDefaultVO를 상속한다 그래서 특별히 java.util.Map을 쓸게 아니면 DxAssetManageVO를 사용한다
<public class DxAssetManageVO extends ComDefaultVO implements Serializable>
- mapper-config.xml 추가
<typeAlias alias = "DxAssetManageVO" 	type = "egovframework.let.dx.asset.service.DxAssetManageVO" />
    	
java.util.Map는 조인을 하거나 임시 20개 정도 다양한 검색이 있을 때

