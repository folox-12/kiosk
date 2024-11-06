export async function getVideosFromServer(nameOfPage, page=1) {
    const res = await fetch(`/${nameOfPage}?` + new URLSearchParams({page}));
    if(res.ok){
        const  data  = await res.json();
        return data
    }
}

export function modifiedNameOfVideo(name) {
    if (!name) return 'Нет названия'
    return name.split('.').slice(0, name.split(".").length - 1).join('');
}
