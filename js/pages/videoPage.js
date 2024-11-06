import AbstractView from "../views/AbstractView.js";
import BackToPage from "../layouts/BackToPage.js";
import { queryToServer } from "../services/queryApi.js";
import { getUrlParam } from "../routing/routing.mjs";
import { modifiedNameOfVideo } from "../services/getVideos.js";

export default class VideoPage extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title);
    }

    props = {
        title: "Видео",
        otherVideo: [],
        videoToShow: 3,
    };

    async renderMainTemplate() {
        const linkToMainVideo = "video/videos/main";
        const mainVideo = await queryToServer({
            nameOfPage: "video/main",
            api: linkToMainVideo,
        });
        

        const videoOtherTemplate = this.props.otherVideo
            .slice(0, this.props.videoToShow)
            .reduce((result, el) => {
                result += `  
                    <div>
                   <div class="video-top-element">
                       <video src='video/videos/${el}' controls></video> 
                   </div>
                   <span class="simple-text">
                    ${modifiedNameOfVideo(el)}
                   </span>
                   </div>
                   `;

                return result;
            }, "");
            
        return `
            <div class="video-page-container">
                <div class="video-container__main">
                   <div class="video-container__video">
                       <video src='${linkToMainVideo}/${mainVideo[0]}' controls></video>
                   </div> 
                   <span class="simple-text">
                    ${modifiedNameOfVideo(mainVideo[0])}
                   </span>
                </div>
                <div class="video-container__top">
                    ${videoOtherTemplate}
                </div>
            </div>
        `;
    }

    async getHtml() {
        let content = "";
        let link = "/";
        let showSecondPage = getUrlParam("show");

        let otherVideo = await queryToServer({
            nameOfPage: "video/main",
            api: "video/videos",
        });

        this.props.otherVideo = otherVideo.filter((el) => el !== "main");

        let to = this.props.otherVideo.slice(this.props.videoToShow).length ? "videoPage?show=true" : "";
   
        if (!showSecondPage) {
            content = await this.renderMainTemplate();
        } else {
            to = "";
            link = "videoPage";
            content = `
                <div class="container">
                    <div class="video-container">
                `
            content += this.props.otherVideo.slice(this.props.videoToShow).reduce((template, file) => {
               return template += `<div>
                <span class="video-title">${modifiedNameOfVideo(file)}</span>
                <video controls>
                    <source src="../video/videos/${file}" />
                </video>
                </div>`;
            }, "");
            content += '</div></div>'
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
