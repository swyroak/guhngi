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
        width: 1000,
        height: 600,
        title: 'マイアプリ',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // get savefilename
    ipcMain.handle('get-filename', async(_e, _arg) => {
        return fs.readdirSync('./save').filter((file) => {
            return file.match(/.json/)
        })
    })

    ipcMain.handle('get-field', async(_e, _arg) => {
        return db.getField('', location, key, (succ, data) => {
            if (succ) {
                return data
            }
        })
    })

    // create table when new game started
    ipcMain.handle('create-table', async(_e, _arg) => {
        const location = path.join(app.getPath('documents'), 'gungi_save')

        fs.access(location, fs.constants.F_OK, (err) => {
            console.log(err)
            fs.mkdir(location, (err) => {
                console.log(err)
            })
        })

        let ansmsg

        console.log('call createtable')

        db.createTable(_arg, location, (succ, msg) => {
            if (succ) {
                ansmsg = 'Aaaa' + msg
            } else {
                ansmsg = 'An error has occured. ' + msg
            }
        })
        return ansmsg
    })

    // add bord data to current game table
    ipcMain.handle('add-data', async(_e, _arg) => {
        let returnMsg
        const location = path.join(app.getPath('documents'), 'gungi_save')
        db.insertTableContent(_arg.gameName, location, _arg.bordCondition, (succ, msg) => {
            returnMsg = msg
        })

        return returnMsg
    })

    ipcMain.handle('search-data', async(_e, _arg) => {
        const location = path.join(app.getPath('documents'), 'gungi_save')
        db.getRows('test', location, _arg, (succ, msg) => {
            console.log(succ)
            console.loglog(msg)
        })
    })

    mainWindow.webContents.openDevTools('left')

    mainWindow.loadFile('index.html')
}

app.once('ready', () => {
    createWindow()
})

app.once('window-all-closed', () => app.quit())