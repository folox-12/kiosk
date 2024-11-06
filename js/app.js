import { navigateTo } from "./routing/routing.mjs";

import sideBar from "./side-bar.js";
// views
import main from "./main.js";
import History from "./pages/history.js";
import creatingNSC from "./pages/creatingNsc.js";
import comandsOfArmy from "./pages/comandsOfArmy.js";
import EmergencySitation from "./pages/emergencySitation.js";
import Swear from "./pages/swear.js";
import Ensemble from "./pages/ensemble.js";
import thanksStaff from "./pages/thanksStaff.js";
import openApp from "./pages/openApp.js";
import fromLive from "./pages/fromLive.js";
import Video from "./pages/videoPage.js";
import { queryToServer } from "./services/queryApi.js";

const pathToRegex = (path) =>
    RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
        (result) => result[1]
    );

    return Object.fromEntries(
        keys.map((key, i) => {
            return [key, values[i]];
        })
    );
};

export const router = async () => {
    const routes = [
        { path: "/", view: main },
        { path: "/historyOfCenter", view: History },
        { path: "/creatingNSC", view: creatingNSC },
        { path: "/comandsOfArmy", view: comandsOfArmy },
        { path: "/emergency", view: EmergencySitation },
        { path: "/swear", view: Swear },
        { path: "/ensemble", view: Ensemble },
        { path: "/thankStaff", view: thanksStaff },
        { path: "/openApp", view: openApp },
        { path: "/fromLive", view: fromLive },
        { path: "/videoPage", view: Video },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path)),
        };
    });
    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.result !== null
    );
    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname],
        };
    }

    const view = new match.route.view(getParams(match));

    const mainTemplate = `
        ${sideBar()} 
        ${await view.getHtml()}
    	`;
    document.querySelector("#app").innerHTML = mainTemplate;
    await view.initComponent();
};
try {
    window.addEventListener("popstate", router);
    document.addEventListener("DOMContentLoaded", async () => {
        document.body.addEventListener("click", async (e) => {
            if (e.target.matches("[data-link]")) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                navigateTo(href);
                router();
            }
            if (e.target.matches("[open-app]")) {
                const nameOfApp = e.target.getAttribute('nameOfApp');
                await queryToServer({nameOfPage: `openAppApi/${nameOfApp}`})
            }
        });
        router();
    });
} catch (errors) {
    console.error(errors);
}
