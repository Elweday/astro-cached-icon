import fs from 'fs';
import checksum from './checksum';

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

async function fetchIcon(icon: Icon | ShortHand): Promise<string | void> {
    const { pack, name } = getIcon(icon)
    const url = `https://api.iconify.design/${pack}/${name}.svg`;
    const content = await fetch(url).then(res => res.text()).catch(function () {console.error("Could not find icon", pack,":", name)});
    return content;
}




export default async function save(icon: Icon | ShortHand) {
    const ic = getIcon(icon)
    const root = "public/cached-icons/";
    const path = root + checksum(ic.pack + ":" + ic.name) + ".svg";
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    if (!fs.existsSync(path)) {
        console.log("fetching", ic.name, "from", ic.pack, "to", path)
        const content = await fetchIcon(ic);
        if (!content) return;
        fs.writeFileSync(path, content);
        return content
    }
    else {
        
        console.log("using cached", ic.name, "from", ic.pack, "at", path)
        const data = fs.readFileSync(path, 'utf8');
        return data;
    }
}

