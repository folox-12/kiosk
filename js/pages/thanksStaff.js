import AbstractView from "../views/AbstractView.js";
import BackToPage from "../layouts/BackToPage.js";
import Swiper from "../../assets/Swiper/swiper-bundle.min.js";

import { queryToServer } from "../services/queryApi.js";

export default class thanksStaff extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title);
    }

    props = {
        title: "Благодарность личному составу",
        slides: "",
    };

    async renderSlides() {
        const allMediaFiles = await queryToServer({
            nameOfPage: "thanksStaff",
        });

        if (allMediaFiles.length) {
            allMediaFiles.forEach((file) => {
                this.props.slides += `<div class="swiper-slide">
                    <img src="../image/thanksStaff/${file}" alt="Фото слайда"/>
                </div>`;
            });
        } else {
            this.props.slides = "Нет фото";
        }
    }
    async initComponent() {
        new Swiper("#thanks-swiper", {
            observer: true,
            observeParents: true,
            slidesPerView: 2,
            slidesPerGroup: 2,
            paginationClickable: true,
            spaceBetween: 30,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });
    }
    async getHtml() {
        let content = "";
        const link = "/";

        await this.renderSlides();
        content = `
                    <div class="swiper" id="thanks-swiper">
                        <div class="swiper-wrapper">
                            ${this.props.slides}
                        </div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>

                        <div class="swiper-scrollbar"></div>
                    </div>
        `;

        const template = new BackToPage({
            content,
            title: this.props.title,
            isBack: link,
        }).render();

        return template;
    }
}
