export async function jsonRequest() {
    return await fetch("./data.json").then(response => {
        response.json().then(jsonData => {
            console.log(jsonData);
        });
    });
}