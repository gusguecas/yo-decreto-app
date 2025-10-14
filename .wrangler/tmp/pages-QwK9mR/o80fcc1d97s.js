// <define:__ROUTES__>
var define_ROUTES_default = { version: 1, include: ["/*"], exclude: ["/download.html", "/static/*"] };

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/gustavo/Desktop/250924 8 39 pm backup/webapp/.wrangler/tmp/pages-QwK9mR/bundledWorker-0.6629464490875826.mjs";
import { isRoutingRuleMatch } from "/Users/gustavo/Desktop/250924 8 39 pm backup/webapp/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/gustavo/Desktop/250924 8 39 pm backup/webapp/.wrangler/tmp/pages-QwK9mR/bundledWorker-0.6629464490875826.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=o80fcc1d97s.js.map
