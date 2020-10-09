const { argv } = require("process");

const items = require("./list.js").list,
      name = "data";

(async () => {
    const itt = items.filter(c => !require(`./${name}.json`).find(b => b.itemID === c.name));
    const getBasicInfo = async (ID) => {

        let link = `https://api.roblox.com/Marketplace/ProductInfo?assetId=${ID}`

        let res = await require("superagent").get(link).catch(() => null);

        if (!res) return null;
        if (res.status !== 200) {
        console.log(`Got ${res.status} while looking up ${item.name}`);
        return null;
    }
    return res.body;
    };
    const getEcoInfo = async (ID) => {
        let link = `https://economy.roblox.com/v1/assets/${ID}/resale-data`

        let res = await require("superagent").get(link).catch(() => null);

        if (!res) return null;
        if (res.status !== 200) {
            console.log(`Got ${res.status} while looking up ${item.name}`);
            return null;
        }
        let item = res.body

        return item
    }
    let num = 0;
    console.log(`This will take about ${require("ms")(itt.length * 1000, {long: true})} to finish.`)
    for (const item of itt){
        if(!item) continue;
        num++;
        setTimeout(async () => {
            let res = await getBasicInfo(item.name);
            if(!res) return console.log(`[res]: No information found for ${item.name}`);
            let r2 = await getEcoInfo(item.name);
            if (r2) res.PriceInRobux = r2.recentAveragePrice
            if(!res.PriceInRobux) return console.log(`[No Price]: For ${item.name}`)
            let json = require(`./${name}.json`);
            let find = json.find(c => c.itemID === item.name);
            let types = {
                8: "hat",
                18: "face",
                19: "gear",
                32: "package",
                41: "hair accessory",
                42: 'face accessory',
                43: 'neck accessory',
                44: 'shoulder accessory',
                45: 'front accessory',
                46: 'back accessory',
                47: 'waist accessory'
            }
            let type = types[res.AssetTypeId] ? types[res.AssetTypeId] : "n/a";
            if(!find){
                json.push({
                    name: res.Name,
                    itemID: item.name,
                    itemWorth: res.PriceInRobux,
                    itemType: type,
                    limited: res.isLimited || res.IsLimitedUnique,
                    img: `https://www.roblox.com/asset-thumbnail/image?assetId=${item.name}&width=420&height=420&format=png`
                });
                require("fs").writeFile(`./${name}.json`, JSON.stringify(json, undefined, 2), (err) => err ? console.log(err) : undefined);
            };
        }, num * 1000)
    }
})()