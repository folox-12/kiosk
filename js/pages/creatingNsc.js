import AbstractView from "../views/AbstractView.js";
import BackToPage from "../layouts/BackToPage.js";
import MenuLink from "../components/menuLink.js";
import Swiper from "../../assets/Swiper/swiper-bundle.min.js";
import { queryToServer } from "../services/queryApi.js";

export default class creatingNSC extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title);
    }

    props = {
        menu: "",
        title: "Образование НСЦ",
        slides: "",
        menuLinks: [
            {
                title: "3-ий Территориальный полк ПВО",
                name: "creatingNSC?part=1",
                api: "PVO",
            },
            {
                title: "1-ый отряд службы МПВО",
                name: "creatingNSC?part=2",
                api: "MPVO",
            },
        ],
    };

    renderMenu() {
        let menuClass = new MenuLink({ links: this.props.menuLinks });
        this.props.menu = menuClass.renderComponent();
    }

    async renderSlides(api) {
        let allMediaFiles = [];
        allMediaFiles = await queryToServer({
            api,
            nameOfPage: "creatingNSCApi",
        });

        if (allMediaFiles.length) {
            allMediaFiles.forEach((file) => {
                this.props.slides += `<div class="swiper-slide">
                    <img src="../image/creatingNSCApi/${api}/${file}" alt="Фото слайда"/>
                </div>`;
            });
        } else {
            this.props.slides = "Нет фото";
        }
    }
    async initComponent() {
        new Swiper("#history-swiper", {
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
        let content = "";
        let link = "/historyOfCenter";
        const urlParams = new URLSearchParams(window.location.search);
        const partName = urlParams.get("part");

        if (!partName) {
            this.renderMenu();
            content = `<div class="creatin-center">${this.props.menu}</div>`;
        } else {
            link = "/creatingNSC";
            await this.renderSlides(this.props.menuLinks[partName - 1].api);
            content = `
                        <div class="swiper" id="history-swiper">
                            <div class="swiper-wrapper">
                                ${this.props.slides}
                            </div>
                            <div class="swiper-pagination"></div>
                            <div class="swiper-button-prev"></div>
                            <div class="swiper-button-next"></div>

                            <div class="swiper-scrollbar"></div>
                        </div>
            `;
        }

        const template = new BackToPage({
            content,
            title: this.props.title,
            isBack: link,
        }).render();

        return template;
    }
}
