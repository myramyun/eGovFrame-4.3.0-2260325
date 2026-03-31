import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bannerImgTab01 from "@/assets/img/home/tab-bg-01.jpg";
import bannerImgMob01 from "@/assets/img/home/mob-bg-01.jpg";
import bannerImgTab02 from "@/assets/img/home/tab-bg-02.jpg";
import bannerImgMob02 from "@/assets/img/home/mob-bg-02.jpg";
import bannerImgTab03 from "@/assets/img/home/tab-bg-03.jpg";
import bannerImgMob03 from "@/assets/img/home/mob-bg-03.jpg";

function DxBanner({ name , delay, x }) {

  const bannerData = {
    main: [
      { id: 1, tabImg: bannerImgTab01, mobImg: bannerImgMob01, title: "페이지 </br>1", desc: "프로그램을 제공합니다", link: "/event1" },
      { id: 2, tabImg: bannerImgTab02, mobImg: bannerImgMob02, title: "페이지 </br>2", desc: "프로그램을 제공합니다", link: "/event2" },
      { id: 3, tabImg: bannerImgTab03, mobImg: bannerImgMob03, title: "페이지 </br>3", desc: "프로그램을 제공합니다", link: "/event3" },
    ],
    game: [
      { id: 1, tabImg: bannerImgTab01, mobImg: bannerImgMob01, title: "페이지 </br>1", desc: "프로그램을 제공합니다", link: "/event1" },
      { id: 2, tabImg: bannerImgTab02, mobImg: bannerImgMob02, title: "페이지 </br>1", desc: "프로그램을 제공합니다", link: "/event2" },
      { id: 3, tabImg: bannerImgTab03, mobImg: bannerImgMob03, title: "페이지 </br>1", desc: "프로그램을 제공합니다", link: "/event3" },
    ]
  };

  const currentList = bannerData[name] || [];
  const className = "dxbnr " + x;

  return (
    <div className={className}>
      <div className="inner">
       <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}   // 슬라이드 간 간격
          slidesPerView={1}  // 한 번에 보여줄 개수
          navigation         // 좌우 화살표
          pagination={{ clickable: true }} // 아래쪽 점(도트)
          autoplay={{ delay: delay }}      // 3초마다 자동 전환
          // className="right_col"
        >
          {currentList.map(e => (
            <SwiperSlide key={e.id}>
              <div className="banner_item">
                <div className="img_box">
                  <img className="w" src={e.tabImg} alt={e.title} />
                  <img className="m" src={e.mobImg} alt={e.title} />
                </div>
                <div className="txt_box">
                  <Link to={e.link}>
                    <div className="w">
                      <strong className="tit" dangerouslySetInnerHTML={{ __html: e.title }}></strong>
                      <p className="desc" dangerouslySetInnerHTML={{ __html: e.desc }}></p>
                    </div>
                    <div className="m">
                      <strong className="tit" dangerouslySetInnerHTML={{ __html: e.title }}></strong>
                      <p className="desc" dangerouslySetInnerHTML={{ __html: e.desc }}></p>
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default DxBanner;


