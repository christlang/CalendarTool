import * as fs from 'fs';
import ical from 'node-ical';

const LINE_WIDTH=200;
const LINE_HEIGHT=60;
const MARGIN_TOP = 200;
const MARGIN=50;
const TEXT_HEIGHT_OFFSET = 40;

class Month {
    constructor(public readonly name: string, public readonly days: number) {
    }
}

const year = 2022;

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

const getEvents = (): Map<string, string[]> => {
    const map = new Map<string, string[]>();
    const events = ical.sync.parseFile('test.ics');

    for (const event of Object.values(events)) {
        console.log(
            `Summary: ${event.type}
            ${JSON.stringify(event)}`
        );
        if (event.type === 'VEVENT') {
            console.log('summary ', event.summary);
            console.log('description ', event.description);
            console.log('start ', event.start, event.start.getFullYear(), event.start.getMonth(), event.start.getDate(), event.start.toDateString());
            console.log('end ', event.end, event.end.toDateString());
            const dateStart = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate(), event.start.getHours(), event.start.getMinutes());
            const dateEnd = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate(), event.end.getHours(), event.end.getMinutes());
            console.log(dateStart.getTime(), dateEnd.getTime());
            console.log((dateEnd.getTime() - dateStart.getTime())/1000);
            console.log((dateEnd.getTime() - dateStart.getTime())/1000/60/60);
            const diffDays = Math.ceil((dateEnd.getTime() - dateStart.getTime())/1000/60/60/24);
            console.log('diffDays: ', diffDays);

            for (let days = 0; days < diffDays; days++) {
                const date = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate()+days);
                const dateString = date.toDateString();
                console.log('dateString: ', dateString);
                if (map.get(dateString) == undefined) {
                    map.set(dateString, []);
                }
                map.get(dateString)!.push(event.summary);
            }


        }
    }
    return map;
}

const main = () => {

    const map = getEvents();

    let svg = '';
    const height = MARGIN_TOP + LINE_HEIGHT * 31 + MARGIN;
    const width = (MARGIN + LINE_WIDTH) * 12 + MARGIN;
    svg += `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += '  <style>\n';
    svg += '    .tiny { font: italic 6px sans-serif; }\n';
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
                const event = map.get(new Date(year, month, day+1).toDateString());
                if (event) {
                    event.forEach((it, i) => {
                        svg += `  <text x="${x + 40}" y="${y + 20+i*10}" class="tiny">${it}</text>\n`;
                    })
                }
            }
        }
    }

    svg += '</svg>';

    fs.writeFileSync(year + '.svg', svg);


    console.log(map.get(new Date(year, 10, 23).toDateString()));
}

main();