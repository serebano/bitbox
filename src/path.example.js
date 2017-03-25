example = Path.select(parts => parts.join("--"));
example.a.b.c.d() == "a--b--c--d";
example.e.f.g.h() == "e--f--g--h";

function urlBuilder(domain) {
    return Path.select(
        (parts, args) =>
            `${domain}${parts.join("/")}?${args.map((arg, idx) => `${idx}=${arg}`).join("&")}`
    );
}

google = urlBuilder("https://google.com/");

google.search.products.bacon.and.eggs() == "https://google.com/search/products/bacon/and/eggs";

const get = Path.create(function get(path, target, ...args) {
    return Path.get(target, path, args);
});

const set = Path.create(function set(path, target, ...args) {
    return Path.set(target, path, args);
});

get(obj);
get(obj, keys);
get.state.users(obj);

get.store.state.app.xxx(this);

set.count(this, num => num + 10);
