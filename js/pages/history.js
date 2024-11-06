import AbstractView from "../views/AbstractView.js";
import MenuLink from "../components/menuLink.js";
import BackToPage from "../layouts/BackToPage.js";
import { getUrlParam } from "../routing/routing.mjs";
import { queryToServer } from "../services/queryApi.js";
import Swiper from "../../assets/Swiper/swiper-bundle.min.js";

export default class History extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.title);
    }

    menu = "";
    title = "История центра";
    menuLinks = [
        {
            title: "Образование НСЦ",
            name: "historyOfCenter?creatingNSC=true",
        },
        {
            title: "Командиры частей",
            name: "comandsOfArmy",
        },
    ];

    renderMenu() {
        const creatingNSC = getUrlParam("creatingNSC");
        let menuClass = new MenuLink({ links: this.menuLinks, centered: !creatingNSC});
        this.menu = menuClass.renderComponent();
    }

    async initComponent() {
        new Swiper("#history-swiper", {
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
        this.renderMenu();
        let content = "";
        const creatingNSC = getUrlParam("creatingNSC");
        let back = "/";

        if (!creatingNSC) {
            content = this.menu;
        } else {
            back = "historyOfCenter";
            const part = getUrlParam("part");
            const creatingNSCMainInfo = await queryToServer({
                nameOfPage: "historyOfCenterApi",
            });
            if (!part) {
                this.title="Образование НСЦ"
                this.setTitle('Образование НСЦ')
                this.menuLinks = Object.keys(creatingNSCMainInfo).map((el) => ({
                    title: el,
                    name: `historyOfCenter?creatingNSC=true&part=${el}`,
                }));
                this.renderMenu();
                content = this.menu;
            } else {
                back = "historyOfCenter?creatingNSC=true";
                const swiperTemplate = creatingNSCMainInfo[part].reduce(
                    (accum, file) => {
                        accum += `<div class="swiper-slide">
                        <img src="../image/creatingNSC/${part}/${file}" alt="Фото слайда"/>
                    </div>`;
                        return accum;
                    },
                    ""
                );
                content = `
                <div class="swiper" id="history-swiper">
                    <div class="swiper-wrapper">
                        ${swiperTemplate}
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>

                    <div class="swiper-scrollbar"></div>
                </div>
    `;
            }
        }

        const template = new BackToPage({
            content,
            title: this.title,
            isBack: back,
        }).render();

        return template;
    }
}
