export const backTo = () => {
    history.back();
}

export const navigateTo = url => {
	history.pushState(null, null, url);
}

export const getUrlParam = name => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
}
