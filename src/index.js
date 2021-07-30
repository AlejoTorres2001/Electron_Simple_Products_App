"use strict";
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
//just for development, remove when build
// const env = process.env.NODE_ENV || "development";
// if (env === "development") {
//   require("electron-reload")(__dirname, {
//     electron: require(`../node_modules/electron`),
//   });
// }

var mainWindow;
var newProductWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true,
    })
  );
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("closed", () => {
    app.quit();
  });
});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    width: 400,
    height: 330,
    title: "Add a new Product",
  });
  newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/add-product.html"),
      protocol: "file",
      slashes: true,
    })
  );
  //newProductWindow.setMenu(null);

  newProductWindow.on("closed", () => {
    newProductWindow = null;
  });
}
ipcMain.on("new-product", (e, newProduct) => {
  mainWindow.webContents.send('new-product',newProduct)
  newProductWindow.close();
});
const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "New Product",
        accelerator: process.platform == "darwin" ? "command+N" : "Ctrl+N",
        click() {
          createNewProductWindow();
        },
      },
      {
        label: "Remove all Products",
        click() {
          mainWindow.webContents.send('products-remove-all')
        },
      },
      {
        label: "Exit",
        accelerator: process.platform == "darwin" ? "command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];
if (process.platform === "darwin") {
  templateMenu.unshift({ label: app.getName() });
}
if (process.env.NODE_ENV !== "production") {
  templateMenu.push({
    label: "Devtools",
    submenu: [
      {
        label: "Show/Hide Dev Tools",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: "Ctrl+D",
      },
      { role: "reload" },
    ],
  });
}
