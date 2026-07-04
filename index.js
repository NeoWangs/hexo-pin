const path = require("path");
const fs = require("hexo-fs");
const renderer = require("./renderer");

hexo.extend.filter.register('before_generate', function(){
  console.log("hexo-pin");
});

// 把相邻的 <li class="pin"> 分组包进插件自己的 <ul>，
// 让瀑布流布局只作用在这个自建容器上，不再依赖/污染主题的正文容器。
hexo.extend.filter.register('after_render:html', function(str){
    if (str.indexOf('class="pin"') === -1) return str;

    const liRe = /<li class="pin"[^>]*>[\s\S]*?<\/li>/g;
    const matches = [];
    let m;
    while ((m = liRe.exec(str))) {
        matches.push({ start: m.index, end: liRe.lastIndex, text: m[0] });
    }
    if (!matches.length) return str;

    let result = "";
    let cursor = 0;
    let i = 0;
    while (i < matches.length) {
        result += str.slice(cursor, matches[i].start);

        const group = [matches[i]];
        let j = i + 1;
        while (j < matches.length && /^\s*$/.test(str.slice(matches[j - 1].end, matches[j].start))) {
            group.push(matches[j]);
            j++;
        }

        result += `<ul class="hexo-pin-wrap">${group.map((g) => g.text).join("")}</ul>`;
        cursor = group[group.length - 1].end;
        i = j;
    }
    result += str.slice(cursor);
    return result;
}, "post");

const style = fs.readFileSync(path.resolve(__dirname, "./templates/assets/masonry.css"), { encoding: "utf8" });
const script = fs.readFileSync(path.resolve(__dirname, "./templates/assets/masonry.js"), { encoding: "utf8" });
const PIN_TEMPLATE = path.resolve(__dirname, "./templates/pin.html");

hexo.extend.injector.register(
    "head_end", () => {
        return `<style type="text/css">${style}</style>`;
    }, "post"
);

hexo.extend.injector.register(
    "head_end",
	`<script type="text/javascript">${script}</script>`,
    "post"
);

hexo.extend.tag.register("pin", (args, content) => {
	 const title = args[0] ? args[0] : "",
			desc = args[1] ? args[1] : "";
	return new Promise((resolve, reject) => {
		renderer.render(PIN_TEMPLATE, { title, desc, content }, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve(res);
		});
	})
}, {ends: true,
	async: true,
});


