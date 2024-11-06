import AbstractView from "../views/AbstractView.js";
import BackToPage from "../layouts/BackToPage.js";
import Swiper from "../../assets/Swiper/swiper-bundle.min.js";

import { queryToServer } from "../services/queryApi.js";

export default class commandsOfArmy extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title);
    }

    props = {
        title: "Командиры частей",
        slides: "",
    };

    async renderSlides(api = null) {
        let allMediaFiles = [];
        allMediaFiles = await queryToServer({ nameOfPage: "comandsOfArmyApi" });

        if (allMediaFiles.length) {
            allMediaFiles.forEach((file) => {
                this.props.slides += `<div class="swiper-slide">
                    <img src="../image/comandsOfArmy/${file}" alt="Фото слайда"/>
                </div>`;
            });
        } else {
            this.props.slides = "Нет фото";
        }
    }
    async initComponent() {
        new Swiper("#comands-swiper", {
            observer: true,
            observeParents: true,
            paginationClickable: true,
            pagination: {
                el: ".swiper-pagination",
            },
            spaceBetween: 30,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
    async getHtml() {
        let content = "";
        const link = "/historyOfCenter";

        await this.renderSlides();
        content = `
                    <div class="swiper" id="comands-swiper">
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
