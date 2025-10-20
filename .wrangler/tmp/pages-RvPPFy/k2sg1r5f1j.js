// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: ["/api/*", "/"],
  exclude: ["/static/*"]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/gustavo/yo-decreto-app/.wrangler/tmp/pages-RvPPFy/bundledWorker-0.10458562724482012.mjs";
import { isRoutingRuleMatch } from "/Users/gustavo/yo-decreto-app/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/gustavo/yo-decreto-app/.wrangler/tmp/pages-RvPPFy/bundledWorker-0.10458562724482012.mjs";
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
//# sourceMappingURL=k2sg1r5f1j.js.map
