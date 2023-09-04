import Editor from "./editor";
import Vue from "vue/dist/vue.js"

import UIkit from "uikit";
import axios from 'axios'

window.editor = new Editor()

window.vue = new Vue({
    el: '#app',
    data:() => ({
        page: 'index.html',
        loader: true,
        pageList: [],
        backupList: [],
        meta: {
            title: '',
            keywords: '',
            desc: ''
        },
        auth: false,
        password: '',
        loginError: false
    }),
    methods: {
        onBtnSave() {
            this.loader = true
            window.editor.save(() => {
                this.loadBackupList()
                this.loader = false
                UIkit.notification({message: 'Успешно сохранено!', status: 'success'})
            },
            () => {
                this.loader = false
                UIkit.notification({message: 'Ощибка при сохранении!', status: 'danger'})
            })
        },
        openPage(page) {
            this.page = page
            this.loadBackupList()
            this.loader = true
            window.editor.open(page, ()=> {
                this.loader = false
                this.meta = window.editor.metaEditor.getMeta()
            })
        },
        loadBackupList() {
            axios
                .get("./backups/backups.json")
                .then(res => {
                    this.backupList = res.data.filter(b => {
                        return (b.page === this.page)
                    })
                })
                .catch(() => {})
        },
        restoreBackup(backup) {
            UIkit.modal
                .confirm('Вы действительно хотите восстановить страницу из этой резервной копии? Все несохраненные изменения будут утеряны!',
                    {labels: {ok: "Восстановить", cancel: "Отмена"}}
                    )
                .then(() => {
                    this.loader = true
                    return axios.post("./api/restoreBackup.php", {"page": backup.page, "file": backup.file })
                })
                .then(() => {
                    this.openPage(this.page)
                })
        },
        applyMeta() {
            window.editor.metaEditor.setMeta(this.meta.title, this.meta.keywords, this.meta.desc)
        },
        enableLoader() {
            this.loader = true
        },
        disableLoader() {
            this.loader = false
        },
        errorNotification(msg) {
            UIkit.notification({message: msg, status: 'danger'})
        },
        login(e) {
            if(this.password.length > 5) {
                axios
                    .post("./api/login.php", {password: this.password})
                    .then(res => {
                        if (res.data.auth === true) {
                            this.auth = true
                            this.start()
                        } else {
                            this.loginError = true
                        }
                    })
            } else {
                this.loginError = true
            }
        },
        start() {
            this.openPage(this.page)
            axios
                .get('./api/pageList.php')
                .then(res => {
                    this.pageList = res.data
                })
        },
        logout() {
            axios
                .get("./api/logout.php")
                .then(() => {
                    window.location.replace("/")
                })
        }
    },
    mounted() {
        axios
            .get("./api/checkAuth.php")
            .then(res => {
                if (res.data.auth === true) {
                    this.auth = true
                    this.start()
                }
            })
        this.loadBackupList()


    }
})
