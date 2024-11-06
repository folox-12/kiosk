import AbstractView from "../views/AbstractView.js";
import { getVideosFromServer, modifiedNameOfVideo } from "../services/getVideos.js";
import BackToPage from "../layouts/BackToPage.js";
import MenuLink from "../components/menuLink.js";

export default class Swear extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title);
    }

    props = {
        title: "Присяги",
        slides: "",
        menu: "",
        menuLinks: [],
    };

    renderMenu() {
        let menuClass = new MenuLink({ links: this.props.menuLinks });
        this.props.menu = menuClass.renderComponent();
    }

    renderVideos(videos, chosenYear) {
        if (videos.length) {
            videos.forEach((file) => {
                this.props.slides += `<div>
                <span class="video-title">${modifiedNameOfVideo(file)}</span>
                <video controls>
                    <source src="../video/swear/${chosenYear}/${file}" />
                </video>
                </div>`;
            });
        } else {
            this.props.slides = "Нет видео";
        }
    }

    async getHtml() {
        let content = "";
        let link = "/";
        const allMediaFiles = await getVideosFromServer("swearApi");

        this.props.menuLinks = Object.keys(allMediaFiles).map((el) => ({
            title: el,
            name: `swear?year=${el}`,
        }));
        this.renderMenu();

        const urlParams = new URLSearchParams(window.location.search);
        const chosenYear = urlParams.get("year");

        if (!chosenYear) {
            content = `
                    <div class="container">
                        ${this.props.menu}
                    </div>
            `;
        } else {
            link = "/swear";
            this.props.title += ` ${chosenYear}`;
            this.renderVideos(allMediaFiles[chosenYear], chosenYear);
            content = `
                                <div class="container">
                                    <div class="video-container">
                                        ${this.props.slides}
                                    </div>
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
