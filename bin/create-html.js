#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

console.log(inquirer)

// Эмуляция __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createHtml({ type, cssToggle }, files) {
    const readFilePath = path.join(__dirname, '../templates', type, 'index.html');

    if (!fs.existsSync(readFilePath)) {
        console.log(`❌ Error: Template ${type} not found`);
        process.exit(1);
    }

    const links = `
    <link rel="stylesheet" href="animations.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="media.css">`;

    let htmlContent = fs.readFileSync(readFilePath, 'utf8');
    htmlContent = htmlContent.replace('<!-- {{cssLinks}} -->', cssToggle ? links : '');

    files.push({
        fileName: 'index.html',
        content: htmlContent
    });
}

function createCssFiles(files) {
    const filesName = ['animations.css', 'style.css', 'media.css'];

    filesName.forEach(item => {
        files.push({
            fileName: item,
            content: ''
        });
    });
}

// Запуск интерактивного меню
inquirer.prompt([
    {
        type: 'list',
        name: 'type',
        message: 'Выберите тип страницы:',
        choices: ['catfish', 'topline', 'fullscreen', 'inpage', 'incontent']
    },
    {
        type: 'confirm',
        name: 'cssToggle',
        message: 'Добавить CSS файлы?',
        default: true
    }
]).then(answers => {
    const settings = answers;
    const files = [];

    console.log(settings);

    createHtml(settings, files);

    if (settings.cssToggle) {
        createCssFiles(files);
    }

    files.forEach(item => {
        const filePath = path.join(process.cwd(), item.fileName);
        fs.writeFileSync(filePath, item.content);
    });

    console.log('✔ Files created, enjoy! 💜');
});
