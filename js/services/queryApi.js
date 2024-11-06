export async function queryToServer({ nameOfPage, api }) {
    try {
        const res = await fetch(
            `/${nameOfPage}?` + new URLSearchParams({ folder: nameOfPage, api })
        );
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (err) {
        console.log(err);
    }
}
