import { fs } from "./deps.ts";
import { routeApi } from "./router.ts";
import { runReadTask } from "./cron/read";
import { runExchangeTask } from "./cron/exchange.js";

const pattern = new URLPattern({ pathname: "/(api|cron)/:name+" });

// 定时任务-自动阅读
Deno.cron("runReadTask", "*/30 * * * *", async () => {
  console.log("start runReadTask");
  await runReadTask();
});

// 定时任务-兑换体验卡
Deno.cron("runExchangeTask", "30 23 * * 0", async () => {
  console.log("start runExchangeTask");
  await runExchangeTask();
})

Deno.serve((req: Request) => {
  const matchResult = pattern.exec(req.url);
  if (matchResult) {
    // api请求
    return routeApi(matchResult.pathname.input, req);
  } else {
    // 静态页面请求
    return fs.serveDir(req, {
      fsRoot: "src/frontend/www",
      quiet: true,
    });
  }
});
