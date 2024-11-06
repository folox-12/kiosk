export default class MenuLink {
    constructor(options) {
        this.links = options.links;
        this.centered= options.centered;
    }

    links = "";
    centered = false;

    renderComponent() {
        let mainTemplate = `<div class='menu ${this.centered ? 'centered' : ''}'>`;
        this.links.forEach((link) => {
            const attribute = link.name ? `data-link href="/${link.name}"`: `open-app nameOfApp="${link.app}"`;
            mainTemplate += `
                <div  ${attribute} class="menu-item"><a ${attribute} class="menu-item__link">${link.title}</a></div>
            `;
        });
        mainTemplate += "</div>";

        return mainTemplate;
    }
}
