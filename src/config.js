// Configuration for different environments
export const SERVER_URL = process.env.NODE_ENV === 'test' ? 'http://localhost:8080' : 'http://localhost:8080';

export const DEFAULT_BBS = { id: "BBSMSTR_AAAAAAAAAAAA", nm: "공지사항" }; // default = 공지사항 게시판 아이디
export const NOTICE_BBS = { id: "BBSMSTR_AAAAAAAAAAAA", nm: "공지사항" }; // 공지사항 게시판 아이디
export const GALLERY_BBS = { id: "BBSMSTR_BBBBBBBBBBBB", nm: "갤러리" }; // 갤러리 게시판 아이디

export const EVENT_BBS_ID = "BBSMSTR_CCCCCCCCCCCC"; // 쇼핑몰 이벤트 게시판 아이디(공지사항)
export const CLOTHING_BBS_ID = "BBSMSTR_DDDDDDDDDDDD"; // 쇼핑몰 의류 게시판 아이디(갤러리)
export const OTHER_BBS_ID = "BBSMSTR_EEEEEEEEEEEE"; // 쇼핑몰 잡화 게시판 아이디(갤러리)


