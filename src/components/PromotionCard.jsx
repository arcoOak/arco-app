
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Pagination } from 'swiper/modules';
import { useAuth } from '../context/AuthContext';
import '../css/PromotionCard.css'

import Button from './buttons/Button';

export default function PromotionCard() {
    const { isDarkTheme } = useAuth();

    return (
        <div className='slider-section'>
            <div className="promotion-section__header">
                <h3 className={`promotion-section__title`}>Promociones</h3>

                <Button
                    onClick={() => navigate('/Promociones')}
                    className='primary'
                >
                    Ver Todo
                </Button>
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