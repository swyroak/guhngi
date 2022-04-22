/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable eol-last */
const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('manipulateDb', {
    createTable: async(ans) => ipcRenderer.invoke('create-table', ans),
    getFileName: async() => ipcRenderer.invoke('get-filename'),
    addData: async() => ipcRenderer.invoke('add-data')
})