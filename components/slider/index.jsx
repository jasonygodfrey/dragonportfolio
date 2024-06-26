import React from 'react';
import PropTypes from 'prop-types';
import { Navigation, Scrollbar, A11y   } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SliderItem from './slider-item';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

Slider.propTypes = {
    data : PropTypes.array,
};

function Slider(props) {
    const {data} = props;
    return (
        <section className="slider">
            <Swiper
                modules={[Navigation,  Scrollbar, A11y ]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    scrollbar={{ draggable: false}}
                    initialSlide={2} // Start with the third slide
                    allowTouchMove={false} // Disable dragging/swiping

                >
                {
                    data.slice(0,3).map(item => (
                        <SwiperSlide key={item.id}>
                            <SliderItem item={item} />
                        </SwiperSlide>
                        
                    ))
                }
            </Swiper> 

        </section>
    );
}

export default Slider;