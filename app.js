
class easyHTTP {

    async get(url) {
        const response = await fetch(url);
        const resData = await response.json();
        return resData;
   }

    async post(theurl, data) {
        const response = await fetch (theurl, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({url: data})
        })
        const resData = await response.json();
        return resData;
    }
}

class UI {
    createURLPost(url, hashid) {
        const newDiv = document.createElement("div");
        newDiv.className = "newURL";
        const urlText = document.createElement("p");
        urlText.textContent = url;
        urlText.className = "regular-link";
        const hashDiv = document.createElement("div");
        hashDiv.className = "hashNewURL";
        const hashURL = document.createElement("p");
        hashURL.textContent = `https://rel.ink/${hashid}`;
        const hashButton = document.createElement("button");
        hashButton.className = "hashButton";
        hashButton.textContent = "Copy";
        hashDiv.appendChild(hashURL);
        hashDiv.appendChild(hashButton);
        newDiv.appendChild(urlText);
        newDiv.appendChild(hashDiv);
        shortenDiv.appendChild(newDiv);
    }

    clearURLs() {
        shortenDiv.innerHTML = "";
    }

    changeCopyButton(button)
    {
        button.classList.add("black-copy");
        button.textContent = "Copied!";
        setTimeout(() => {
            button.classList.remove("black-copy");
            button.textContent = "Copy";
        }, 3000)
    }
}

class LocalStorage {

    constructor() {
        this.urls = []
    }

    loadURLs() {
        const urls = localStorage.getItem("URLs");
        if (urls !== null) {
            this.urls = JSON.parse(urls);
        }
        return this.urls;
    }

    addURL(url, hashurl) {
        if (this.urls.length >= 4) {
            this.urls.splice(0, 1);
        }
        this.urls.push({ url, hashurl });
        localStorage.setItem("URLs", JSON.stringify(this.urls));
    }
}

const shortenInput = document.querySelector("#shorten-input");
const shortenDiv = document.querySelector(".shorten");
const easyhttp = new easyHTTP();
const ui = new UI();
const ls = new LocalStorage();
const shortenBtn = document.querySelector(".shorten-btn")
  .addEventListener("click", (e) => {
      easyhttp.post(`https://rel.ink/api/links/?url=${shortenInput.value}`, shortenInput.value)
        .then(data => {
            ls.addURL(data.url, data.hashid);
            ui.clearURLs();
            ls.loadURLs().forEach(url => {
                ui.createURLPost(url.url, url.hashurl)
            });
        })
        .catch(err => console.log(err));
})

shortenDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("hashButton")){
        navigator.clipboard.writeText(e.target.previousElementSibling.textContent)
          .then(() =>  {
              ui.changeCopyButton(e.target);
        })
          .catch(err => console.log(err));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    ls.loadURLs().forEach(url => {
        ui.createURLPost(url.url, url.hashurl)
    });
});