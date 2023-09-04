import axios from "axios"
export default class EditorImages {
    constructor(element, virtualElement) {
        this.element = element
        this.virtualElement = virtualElement

        this.element.addEventListener("click", () => this.onClick())

        this.imgUploader = document.querySelector("#img-upload")
    }

    onClick() {
        this.imgUploader.click()
        this.imgUploader.onchange = () => {
            if(this.imgUploader.files && this.imgUploader.files[0]) {
                window.vue.enableLoader()
                let formData = new FormData()
                formData.append("image", this.imgUploader.files[0])
                axios
                    .post("./api/uploadImage.php", formData, {
                        headers: {
                            "Content-type": "multipart/form-data"
                        }
                    })
                    .then((res) => {
                        this.virtualElement.src = this.element.src = "/img/" + res.data.src;
                    })
                    .catch(() => window.vue.errorNotification("Ошибка загрузки изображения"))
                    .finally(() => {
                        this.imgUploader.value = ""
                        window.vue.disableLoader()
                    })
            }

        }
    }
}