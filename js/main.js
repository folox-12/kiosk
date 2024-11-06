import AbstractView from "./views/AbstractView.js";
import Swiper from "../assets/Swiper/swiper-bundle.min.js";
import MenuLink from "./components/menuLink.js";
import { queryToServer } from "./services/queryApi.js";

export default class Main extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Главная");
    }

    slides = "";
    menu = "";

    menuLinks = [
        {
            title: "История центра",
            name: "historyOfCenter",
        },
        {
            title: "Чрезвычайные ситуации",
            name: "emergency",
        },
        {
            title: "Присяги",
            name: "swear",
        },
        {
            title: "Ансамбль спасатель",
            name: "ensemble",
        },
        {
            title: "Музей",
            app: "museum"
        },
        {
            title: "Благодарности личному составу",
            name: "thankStaff",
        },
        {
            title: "Из жизни центра",
            name: "fromLive",
        },
        {
            title: "Видео",
            name: "videoPage",
        },
    ];

    async renderSlides() {
        let allMediaFiles = [];
        allMediaFiles = await queryToServer({ nameOfPage: "main" });

        if (allMediaFiles.length) {
            allMediaFiles.forEach((file) => {
                this.slides += `
                <div class="swiper-slide">
                    <img src="../image/main/${file}" alt="Фото слайда" />
                </div>`;
            });
        } else {
            this.slides = "Нет фото";
        }
    }

    renderMenu() {
        let menuClass = new MenuLink({ links: this.menuLinks });
        this.menu = menuClass.renderComponent();
    }

    async initComponent() {
        new Swiper("#main-swiper", {
            observer: true,
            observeParents: true,
            paginationClickable: true,
            spaceBetween: 30,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

    async getHtml() {
        await this.renderSlides();
        this.renderMenu();

        const swiperTemplate = `
                    <div class="swiper" id="main-swiper">
                        <div class="swiper-wrapper">
                            ${this.slides}
                        </div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
        `;
        return `
                <div class="main">
                    ${swiperTemplate}
                    ${this.menu}
                </div>
                `;
    }
}
