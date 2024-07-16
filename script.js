const url = "https://api.dicionario-aberto.net/word/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data[0].xml, "application/xml");

            const htmlContent = xmlToHtml(xmlDoc.documentElement);
            result.innerHTML = "";  // Limpar o resultado anterior
            result.appendChild(htmlContent);
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Não foi possível encontrar a palavra</h3>`;
        });
});

function xmlToHtml(xmlNode) {
    const div = document.createElement("div");
    // Recursivamente criar elementos HTML
    xmlNode.childNodes.forEach(childNode => {
        if (childNode.nodeType === 1) { // Element node
            const childElement = document.createElement(childNode.nodeName);
            if (childNode.nodeName === "entry") {
                childElement.classList.add("definition");
            }
            if (childNode.attributes) {
                Array.from(childNode.attributes).forEach(attr => {
                    childElement.setAttribute(attr.name, attr.value);
                });
            }
            const childHtml = xmlToHtml(childNode);
            childElement.appendChild(childHtml);
            div.appendChild(childElement);
        } else if (childNode.nodeType === 3) {
            let textContent = childNode.nodeValue.trim();
            if (textContent) {
                const p = document.createElement("p");
                p.textContent = textContent;
                div.appendChild(p);
            }
        }
    });
    return div;
}