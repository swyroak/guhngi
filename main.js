/* eslint-disable eol-last */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const db = require('electron-db')
const fs = require('fs')

require('electron-reload')(__dirname, {
    // eslint-disable-next-line no-template-curly-in-string
    electron: require('${__dirname}/../../node_modules/electron')
})

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'マイアプリ',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')

        }
    })

    ipcMain.handle('get-filename', async(_e, _arg) => {
        return fs.readdirSync('./save').filter((file) => {
            return file.match(/.json/)
        })
    })

    ipcMain.handle('create-table', async(_e, _arg) => {
        const location = path.join(__dirname, '')
        let ansmsg
        db.createTable(_arg, location, (succ, msg) => {
            if (succ) {
                ansmsg = msg
            } else {
                ansmsg = 'An error has occured. ' + msg
            }
        })
        return ansmsg
    })

    mainWindow.webContents.openDevTools('left')

    mainWindow.loadFile('index.html')
}

app.once('ready', () => {
    createWindow()
})

app.once('window-all-closed', () => app.quit())