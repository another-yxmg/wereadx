import { fs } from "./deps.ts";
import { routeApi } from "./router.ts";
import { runReadTask } from "./cron/read.ts";
import { runExchangeTask } from "./cron/exchange.ts";

const pattern = new URLPattern({ pathname: "/(api|cron)/:name+" });

// 定时任务-自动阅读
Deno.cron("runReadTask", "0 0/30 * * * ?", async () => {
  console.log("start runReadTask");
  await runReadTask();
});

// 定时任务-兑换体验卡
Deno.cron("runExchangeTask", "0 0 12 ? * FRI", async () => {
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
