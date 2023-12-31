import fs from 'fs';
import checksum from './checksum';

const fallback = `
    <svg>
        <path>
        </path>
    </svg>
`;


const DIR = "assets/cached-icons/"
const PARENT = "public/" + DIR


type Icon = { pack: string, name: string }
type ShortHand = string;

function getIcon(icon: Icon | string): { pack: string; name: string } {
    if (isIcon(icon)) {
        return { pack: icon.pack, name: icon.name }; // Extract properties for consistency
    } else if (typeof icon == 'string') {
        const [pack, name] = icon.split(':');
        return  { pack, name };
     }
     else throw new Error('Invalid icon format');
}

function isIcon(value: any): value is Icon {
    return typeof value === 'object' && value !== null && 'pack' in value && 'name' in value; // Check for required properties
}

async function fetchIcon(icon: Icon | ShortHand): Promise<string> {
    const { pack, name } = getIcon(icon)
    const url = `https://api.iconify.design/${pack}/${name}.svg`;
    const content = await fetch(url).then(res => res.text());
    return content;
}


export default async function load(icon: Icon | ShortHand) {
    const ic = getIcon(icon)
    const filename =  checksum(ic.pack + ":" + ic.name) + ".svg"
    const PARENT = root + filename;

    if (!fs.existsSync(path) && process.env.NODE_ENV !== "production") {
        console.log("fetching", ic.name, "from", ic.pack, "to", path)
        const content = await fetchIcon(ic);
        fs.writeFileSync(path, content);
        return content
    }
    else {
        try {
            const data = await import(/* @vite-ignore */ +"/" + DIR + filename +"?raw" );
            return data.default;
        }
        catch {
            console.log("failed to load", ic.name, "from", ic.pack, "using fallback")
            return fallback;
        }
    }

}

