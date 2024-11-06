import AbstractView from "../views/AbstractView.js";
import BackToPage from "../layouts/BackToPage.js";
import MenuLink from "../components/menuLink.js";
import { queryToServer } from "../services/queryApi.js";

export default class fromLive extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(this.props.title);
    }

    props = {
        title: "Из жизни центра",
        slides: "",
        menu: "",
        menuLinks: [],
        eventsLinks: [],
    };

    renderMenu(links) {
        let menuClass = new MenuLink({ links: links });
        return menuClass.renderComponent();
    }

    renderImagesTemplate({ images, path }) {
        let imagesContainer = '<div class="images-container">';
        images.forEach((el) => {
            imagesContainer += `
                    <img class="images-container__item" src="${path}/${el}" />
            `;
        });
        imagesContainer += "</div>";

        return imagesContainer;
    }

    renderEventsTemplate({ images, text }) {
        return `<div class="events-container">
        <div class="events-container__img">${images}</div>
        <div class="events-container__desc"><span class="simple-text">${text}</span><div>
        </div>`;
    }

    makeEventsLinks(chosenEvent, chosenYear) {
        this.props.eventsLinks = Object.keys(chosenEvent).map((el) => ({
            title: el,
            name: `fromLive?year=${chosenYear}&&event=${el}`,
        }));
    }

    async getHtml() {
        let content = "";
        let link = "/";
        const allMediaFiles = await queryToServer({
            nameOfPage: "fromLiveApi",
        });

        this.props.menuLinks = Object.keys(allMediaFiles).map((el) => ({
            title: el,
            name: `fromLive?year=${el}`,
        }));
        const menu = this.renderMenu(this.props.menuLinks);

        const urlParams = new URLSearchParams(window.location.search);
        const chosenYear = urlParams.get("year");
        const chosenEvent = urlParams.get("event");

        if (!chosenYear) {
            content = `
                        ${menu}
            `;
        } else {
            if (!chosenEvent) {
                link = "/fromLive";
                this.props.title += ` ${chosenYear}`;
                const chosenEventInfo = allMediaFiles[chosenYear];
                this.props.eventsLinks = Object.keys(chosenEventInfo).map(
                    (el) => ({
                        title: el,
                        name: `fromLive?year=${chosenYear}&&event=${el}`,
                    })
                );

                const menu = this.renderMenu(this.props.eventsLinks);

                content = `
                    ${menu}
                `;
            } else {
                this.props.title = ` ${chosenEvent}`;
                link = `/fromLive?year=${chosenYear}`;
                const info = allMediaFiles[chosenYear][chosenEvent];
                const allImage = info.filter((el) =>
                    ["png", "jpg", "jpeg"].includes(el.split(".")[1])
                );
                const description = info.find((el) => el === "description.txt");
                const pathToFiles = `image/fromLive/${chosenYear}/${chosenEvent}`;

                if (description) {
                    const { text } = await queryToServer({
                        nameOfPage: "fromLiveApi/description",
                        api: `${pathToFiles}/${description}`,
                    });

                    const imagesContainer = this.renderImagesTemplate({
                        images: allImage,
                        path: pathToFiles,
                    });
                    content = this.renderEventsTemplate({
                        images: imagesContainer,
                        text,
                    });
                }
            }
        }

        const template = new BackToPage({
            content,
            title: this.props.title,
            isBack: link,
        }).render();
        return template;
    }
}
