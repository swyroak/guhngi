const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('manipulateDb', {
  createTable: async (ans) => ipcRenderer.invoke('create-table', ans),
  getFileName: async () => ipcRenderer.invoke('get-filename')
})
