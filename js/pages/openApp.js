import AbstractView from "../views/AbstractView.js";
import { queryToServer } from "../services/queryApi.js";

export default class openApp extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Открыть");
    }

    async getHtml() {
        location.href = "/";
        await queryToServer({ nameOfPage: "openAppApi" });
    }
}
