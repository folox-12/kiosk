import { fileURLToPath } from "url";
import { dirname } from "path";
import * as path from "path";
import express, { json } from "express";
import {
    getSortedFiles,
    getModifiedVideosByYear,
    getFromLiveFiles,
    simpleReadFile,
} from "./js/server/readingFile.js";
import { getAboutText } from "./js/server/ensemble/readText.js";
import { exec } from "child_process";
import { writeFileSync, unlinkSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.static(__dirname));
app.use("/", express.static(path.resolve(__dirname, "/", "/")));
app.get("/history", async (req, res) => {
    const result = await getSortedFiles("history");
    res.send(result);
});

app.get("/main", async (req, res) => {
    const result = await getSortedFiles("main");
    res.send(result);
});

app.get("/historyOfCenterApi", async (req, res) => {
    const result = await getModifiedVideosByYear("creatingNSC", false);
  
    res.send(result);
});

app.get("/creatingNSCApi", async (req, res) => {
    const {
        query: { api },
    } = req;
    const result = await getSortedFiles(`creatingNSCApi/${api}`);
    res.send(result);
});

app.get("/emergencySituation", async (req, res) => {
    const result = await getModifiedVideosByYear(`emergencySituation`);
    res.send(result);
});

app.get("/swearApi", async (req, res) => {
    const result = await getModifiedVideosByYear(`swear`);
    res.send(result);
});

app.get("/ensembleApi", async (req, res) => {
    const result = await getSortedFiles("ensemble");
    res.send(result);
});

app.get("/ensembleAbout", async (req, res) => {
    const result = await getAboutText();
    res.send(result);
});

app.get("/ensembleMusic", async (req, res) => {
    const result = await getSortedFiles("ensemble", false, true);
    res.send(result);
});

app.get("/thanksStaff", async (req, res) => {
    const result = await getSortedFiles("thanksStaff");
    res.send(result);
});

app.get("/comandsOfArmyApi", async (req, res) => {
    const result = await getSortedFiles(`comandsOfArmy`);
    res.send(result);
});

app.get("/openAppApi/museum", async (req, res) => {
    // exec(`powershell.exe -Command "C:/Users/admin/Documents/NeiroPython/web/startMuseum.ps1"`, (error) => {
    //     if (error) res.send({error})
    //     res.send({open: true})
    // });
    // const vbscriptCode = `
    //     Set objShell = WScript.CreateObject("WScript.Shell")

    //     ' Запускаем Notepad
    //     objShell.Run "notepad", 1, False 

    //     ' Ждем, пока Notepad запустится
    //     WScript.Sleep 500

    //     ' Получаем идентификатор окна Notepad
    //     hwnd = objShell.AppActivate("notepad")

    //     ' Активируем окно Notepad и делаем его поверх всех окон
    //     If hwnd <> 0 Then
    //         objShell.SendKeys "% "
    //         objShell.SendKeys "{UP}"
    //     End If
    // `;

    // // Сохраняем VBScript код в временный файл
    // const tempFilePath = `${__dirname}/temp.vbs`;
    // writeFileSync(tempFilePath, vbscriptCode);

    // // Запускаем VBScript через PowerShell, экранируя кавычки в пути к файлу
    // exec(`powershell -Command "cscript //Nologo \\\"${tempFilePath}\\\""`, (error, stdout, stderr) => {
    // if (error) {
    //     console.error(`Ошибка выполнения команды: ${error}`);
    //     return;
    // }
    
    // });
    // // Удаляем временный файл
    // unlinkSync(tempFilePath);


});

app.get("/fromLiveApi", async (req, res) => {
    const result = getFromLiveFiles("image/fromLive");
    res.send(result);
});

app.get("/fromLiveApi/description", async (req, res) => {
    const {
        query: { api },
    } = req;

    const result = await getAboutText(api);
    res.send(result);
});

app.get("/video/main", async (req, res) => {
    const {
        query: { api },
    } = req;
    const result = await simpleReadFile(api);
    res.send(result);
});
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./", "index.html"));
});
app.get("/*/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./", "index.html"));
});

app.set("port", 8080);
app.set("express.staticBufferAllowed", true);
app.listen(app.get("port"), () =>
    console.log("Server started: http://localhost:" + app.get("port") + "/")
);
