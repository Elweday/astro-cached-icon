import fs from 'node:fs';

const FALLBACK = `
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
	<path fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m6 11l5-5l13 13L37 6l5 5l-13 13l13 13l-5 5l-13-13l-13 13l-5-5l13-13z" clip-rule="evenodd" />
</svg>`;

type Icon = { pack: string, name: string }
type ShortHand = string;

async function fetchIcon({ pack, name }: Icon): Promise<{innerHTML: string, ok: boolean}> {
    const url = `https://api.iconify.design/${pack}/${name}.svg`;
    const res = await fetch(url)
    const text = await res.text()
    if (text !== "404") {
        return {innerHTML: text, ok: true};
    }
    return {innerHTML: FALLBACK, ok: false};
}

export async function load(icon?: ShortHand, name?: string, pack?: string): Promise<string> {
    let ic: Icon;
    let innerHTML = FALLBACK;
    if (name && pack) {
        ic = { pack, name }; // Extract properties for consistency
    } else if (icon) {
        const [pack, name] = icon.split(':');
        ic ={ pack, name };
     }
    else throw new Error('Invalid icon format');
    const ROOT =  process.env.NODE_ENV !== "production" ? "/cached-icons" : "public/cached-icons" ;

    const filename =  ic.name + ".svg"
    const dir = ROOT +  "/" + ic.pack
    const path = dir + "/" + filename

    const exists = fs.existsSync(path);
    if (!exists && process.env.NODE_ENV !== "production") {

    const {innerHTML: content, ok} = await fetchIcon(ic);
        fs.mkdir(dir, { recursive: true }, () => {});
        fs.writeFile(path, content, () => {
            if (ok) {
                console.log(`downloaded icon ${ic.name}:${ic.pack} to ${path}`)
            }
            else {
                console.log(`failed to download icon ${ic.name}:${ic.pack} to ${path}, icon does not exist on the iconify repository.`)
            }
        });
        if (content) {
            innerHTML = content;
        }
    } else { 
        try {
            const data = await import(path +"?raw");
            if (data.default) {
                innerHTML = data.default;
            }
        }
        catch (e) {
            console.log(`failed to load icon ${ic.name}:${ic.pack} from ${path}, icon does not exist on the bundle.`)
        }
    }
    return innerHTML;

}
