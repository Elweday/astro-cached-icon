const fallbackIcon = ({iconName} : {iconName: string}) =>`
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048">
    <title> Failed to load icon ${iconName}</title>
	<path fill="red" d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0m0 1792q114 0 220-30t199-84t169-130t130-168t84-199t30-221q0-114-30-220t-84-199t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 114 30 220t84 199t130 169t168 130t199 84t221 30M896 512h128v640H896zm0 768h128v128H896z" />
</svg>`;

type Icon = { pack: string, name: string }
type ShortHand = string;

async function fetchIcon({ pack, name }: Icon): Promise<string> {
    const iconName = `${pack}:${name}`
    const url = `https://api.iconify.design/${pack}/${name}.svg`;
    const res = await fetch(url)
    const text = await res.text()
    const found = text !== "404"
    if (found) {
        console.log(`downloaded icon ${iconName}`)
        return text
    }
    else {
        console.log(`failed to download icon ${iconName}, icon does not exist on the iconify repository.`)
        return fallbackIcon({ iconName });
    }
}

async function loadIconFromBundle(iconName: string, path: string): Promise<string|void> {

    try {        
        const data = await import(/* @vite-ignore */`${path}?raw`);
        return data.default
    }
    catch (error) {
        console.log(`failed to load icon ${iconName} from ${path}`)
    }
}

async function writeIcon(dir: string, path: string, content: string): Promise<void> {
    const fs = await import ('node:fs');
    await fs.mkdir(`public/${dir}`, { recursive: true }, () => {});
    await fs.writeFile(`public/${path}`, content, () => {});
}

const getIconName = (icon?: ShortHand, name?: string, pack?: string): {icon: ShortHand, name: string, pack: string} => {
    let ic: Icon;
    if (name && pack) {
        ic = { pack, name };
    } else if (icon) {
        const [pack, name] = icon.split(':');
        ic ={ pack, name };
     }
     else throw new Error('Invalid icon format');

     return {
        pack: ic.pack,
        name: ic.name,
        icon: `${ic.pack}:${ic.name}`
     }

}

export async function load(icon?: ShortHand, name?: string, pack?: string): Promise<string> {
    const ic = getIconName(icon, name, pack);
    let innerHTML = fallbackIcon({ iconName: ic.icon });
    const dir =  `/icons/${ic.pack}`;
    const path = `${dir}/${ic.name}.svg`;
    if (process.env.NODE_ENV !== "production") {
        const fs = await import ('node:fs');
        if (!fs.existsSync("public/"+path)) {
            const content = await fetchIcon(ic);
            await writeIcon(dir, path, content);
            innerHTML = content ? content : innerHTML;
        }
        else {
            const loaded = await loadIconFromBundle(ic.icon, path);
            innerHTML = loaded ? loaded : innerHTML;
        }
    } else { 
        const loaded = await loadIconFromBundle(ic.icon, path);
        innerHTML = loaded ? loaded : innerHTML;
    }
    return innerHTML;
}