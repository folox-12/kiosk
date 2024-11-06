import AbstractView from "../views/AbstractView.js";
import { getUrlParam } from "../routing/routing.mjs";
import BackToPage from "../layouts/BackToPage.js";
import { queryToServer } from "../services/queryApi.js";

export default class Ensemble extends AbstractView {
    constructor(options) {
        super(options);
        this.setTitle(this.props.title);
    }

    props = {
        title: "Ансамбль спасатель",
        showMusic: false,
        image: "",
    };

    renderInfo() {
        return "info";
    }

    async getImage() {
        const result = await queryToServer({
            nameOfPage: "ensembleApi",
        });

        this.props.image = result[0];
    }
    async getHtml() {
        let link = "/";
        let to = "/ensemble?showMusic=true";
        let content = "";
        this.props.showMusic = !!getUrlParam("showMusic");

        if (this.props.showMusic) {
            to = "";
            link = "/ensemble";
            const musicsName = await queryToServer({
                nameOfPage: "ensembleMusic",
            });

            content = '<div class="ensemble-music">';

            musicsName.forEach((music) => {
                content += `
                    <div class="ensemble-music__element">
                        <audio
                            src="../../music/ensemble/${music}"
                            controls
                        ></audio>
                        <span> ${music} </span>
                    </div>
                `;
            });

            content += "</div>";
        } else {
            const { text } = await queryToServer({
                nameOfPage: "ensembleAbout",
            });

            await this.getImage();

            content = `
                <div class="ensemble">
                    <img class="ensemble-img" src="../../image/ensemble/${this.props.image}" /> 
                    <div class="ensemble-text"> ${text} </div> 
                </div> 
            `;
        }

        const template = new BackToPage({
            content,
            title: this.props.title,
            isBack: link,
            to,
        }).render();

        return template;
    }
}
