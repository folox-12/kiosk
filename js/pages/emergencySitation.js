import AbstractView from "../views/AbstractView.js";
import { getVideosFromServer } from "../services/getVideos.js";
import BackToPage from "../layouts/BackToPage.js";
import MenuLink from "../components/menuLink.js";
import { modifiedNameOfVideo } from "../services/getVideos.js";

export default class EmergencySitation extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title)
    }


    props= {
        title: 'Чрезвычайные ситуации',
        slides: "",
        menu: "",
        menuLinks: [],
    }

    renderMenu() {
        let menuClass = new MenuLink({links: this.props.menuLinks});
        this.props.menu = menuClass.renderComponent();
    }

    renderVideos(videos, chosenYear) {
        if (videos.length) {
            videos.forEach((file) => {
                this.props.slides += `<div>
                <span class="video-title">${modifiedNameOfVideo(file)}</span>
                <video controls>
                    <source src="../video/emergencySituation/${chosenYear}/${file}" />
                </video>
                </div>`
            })
        } else {
            this.props.slides = 'Нет видео';
        }
    }

    async getHtml() {
        let content = "";
        let link = '/';
        const allMediaFiles = await getVideosFromServer('emergencySituation');
 

        this.props.menuLinks = Object.keys(allMediaFiles).map(el => ({
            title: el,
            name: `emergency?year=${ el }`,
        })) 
        this.renderMenu()

        const urlParams = new URLSearchParams(window.location.search);
        const chosenYear = urlParams.get('year');

        if (!chosenYear) {
        content = `
                    <div class="container">
                        ${this.props.menu}
                    </div>
            `

        } else {
            link="/emergency"
            this.props.title += ` ${chosenYear}`
            this.renderVideos(allMediaFiles[chosenYear], chosenYear)
            content = `
                                <div class="container">
                                    <div class="video-container">
                                        ${this.props.slides}
                                    </div>
                                </div>
                `
        }

        const template = new BackToPage({ content, title: this.props.title, isBack: link }).render()
        return template 
    }
}
