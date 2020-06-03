const url = require("url")
const electron = require('electron')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron;

let MainWindow;
let addWindow;

app.on('ready', () => {
    MainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration:true,
        },
        title:"Shopping List"
    });

    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "src","index.html"),
        protocol:'file:',
        slashes:true
    }))

    const MainMenu = Menu.buildFromTemplate(MenuTemplate)
    Menu.setApplicationMenu(MainMenu)

    MainWindow.on('close',
    () => app.quit()
    )
})



function addItemWindow(){
    addWindow = new BrowserWindow({
        title:"Add item",
        width:300,
        height:200,
        webPreferences: {
            nodeIntegration:true,
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "src","addWindow.html"),
        protocol:'file:',
        slashes:true
    }))

    const MainMenu = Menu.buildFromTemplate(MenuTemplate)
    Menu.setApplicationMenu(MainMenu)

    addWindow.on('close',
    () => addWindow = null
    )

}


// catches add:item event and sends it to the main window
ipcMain.on('add:item', (e, item) => {
    MainWindow.webContents.send('add:item', item)
})



let MenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    addItemWindow()
                }
            },
            {
                label:'Clear Items',
                click(){
                    MainWindow.webContents.send('clear:item')
                }
            },
            {
                label:'Quit',
                accelerator:process.platform == 'win32' ? "Ctrl+Q" : "Command+Q",
                click(){
                    app.quit()
                }
            }
        ]
    },
    {
        label:'Help'
    }
]

// for handling platform specific bug
MenuTemplate = process.platform == 'darwin' ? MenuTemplate.unshift({}) : MenuTemplate;


// for developer option if app is not in production 

if( process.env.NODE_ENV !== 'production'){
    MenuTemplate.push(
        {
            label:"Developer Options",
            submenu:[
                {
                    label:"Dev Tools",
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools()
                    },
                    accelerator:process.platform == 'win32' ? "Ctrl+I" : "Command+I",
                },
                {
                    role:'reload'
                }
            ]
           
        }
    )
}