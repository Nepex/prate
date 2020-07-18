const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let isQuiting;
let tray;

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname.slice(0, -12), 'dist/favicon.ico'),
    });

    tray = new Tray(path.join(__dirname.slice(0, -12), 'dist/favicon.ico'));

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Open', click: function () {
                win.show();
            }
        },
        {
            label: 'Quit', click: function () {
                isQuiting = true;
                app.quit();
            }
        }
    ]));

    tray.on('double-click', function (event) {
        win.show();
    });

    win.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            win.hide();
            event.returnValue = false;
        }
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: 'prate.club',
        protocol: 'https:',
        slashes: true
    }));

    win.setMenuBarVisibility(false)

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.

        // win = null;
    });
}

// app.on('ready', createWindow);


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            // if (win.isMinimized()) win.restore()
            // win.focus()
            win.show();
        }
    })

    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        // if (process.platform !== 'darwin') {
        //     app.quit();
        // }
    });

    app.on('before-quit', function () {
        isQuiting = true;
    });

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}






