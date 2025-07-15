
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Pagination } from 'swiper/modules';
import '../css/Slider.css'

export default function Slider() {
    return (
        <div className='slider-section'>
            <div className="trainer-section__header">
                <h3 className="trainer-section__title">Promociones</h3>
                <button className='button__see-all'>
                    <a href="#" className="trainer-section__see-all">Ver Todo</a>
                </button>
            </div>

            <Swiper
                effect={'cube'}
                grabCursor={true}
                cubeEffect={{
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                }}
                pagination={true}
                modules={[EffectCube, Pagination]}
                className="mySwiper"
            >

                <SwiperSlide>
                    <img src="../src/img/proms/1.png" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="../src/img/proms/2.png" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="../src/img/proms/3.png" />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}