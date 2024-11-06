export default class BackToPageLayout {
    constructor({ content, title, isBack, to }) {
        this.props = { ...this.props, content, title, isBack, to };
    }

    props = {
        content: "",
        title: "",
        isBack: "",
        to: "",
    };

    buttonContent = "";

    renderButtons() {
        let buttonContent = `
         <div class="back-to-page-head__buttons">
        <a data-link href="${this.props.isBack}" class="kiosk kiosk-back">Назад</a>`;
        if (this.props.to) {
            buttonContent += `<a data-link href="${this.props.to}" class="kiosk kiosk-back">Вперед</a>`;
        }
        buttonContent += `
            <a data-link href="/" class="kiosk">Вернуться на главную</a>
        </div>`;
        return buttonContent;
    }

    render() {
        this.buttonContent = this.renderButtons();
        return `
            <div class="back-to-page">
                <div class="back-to-page-head">
                    <span class="back-to-page__title"> ${this.props.title}</span>
                    ${this.buttonContent}
                </div>
                <div class="back-to-page-content">${this.props.content}</div>
            </div>
        `;
    }
}
