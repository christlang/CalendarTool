import * as fs from 'fs';

const LINE_WIDTH=200;
const LINE_HEIGHT=60;
const MARGIN_TOP = 200;
const MARGIN=50;
const TEXT_HEIGHT_OFFSET = 40;

class Month {
    constructor(public readonly name: string, public readonly days: number) {
    }
}

const MONTH = [new Month('JANUAR', 31),
    new Month('Februar', 29),
    new Month('März', 31),
    new Month('April', 30),
    new Month('Mai', 31),
    new Month('Juni', 30),
    new Month('Juli', 31),
    new Month('August', 31),
    new Month('September', 30),
    new Month('Oktober', 31),
    new Month('November', 30),
    new Month('Dezember', 31)];

const main = () => {
    let svg = '';
    const height = MARGIN_TOP + LINE_HEIGHT * 31 + MARGIN;
    const width = (MARGIN + LINE_WIDTH) * 12 + MARGIN;
    svg += `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += '  <style>\n';
    svg += '    .small { font: italic 26px sans-serif; }\n';
    svg += '    .heavy { font: italic 40px sans-serif; }\n';
    svg += '  </style>\n'

    svg += '  <rect width="100%" height="100%" fill="white"/>\n';
    for (let month=0; month<12; ++month) {
        const x = MARGIN + (MARGIN + LINE_WIDTH) * month;
        svg += `  <image href="./svgs/${month + 1}.svg" x="${x+20}" y="${MARGIN_TOP - 180}" height="150" width="150" />`
        svg += `  <text x="${x + 20}" y="${MARGIN_TOP - 10}" class="heavy">${MONTH[month].name}</text>\n`;
        for (let day=0; day<32; ++day) {
            const y = MARGIN_TOP + day*LINE_HEIGHT;
            const width = LINE_WIDTH;
            svg += `  <line x1="${x}" y1="${y}" x2="${x+width}" y2="${y}" stroke="black" />\n`;

            if (day < MONTH[month].days ) {
                svg += `  <text x="${x}" y="${y + TEXT_HEIGHT_OFFSET}" class="small">${day + 1}</text>\n`;
            }
        }
    }

    svg += '</svg>';

    fs.writeFileSync('test.svg', svg);
}

main();