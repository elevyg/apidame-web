import posthog from "posthog-js";
import { dropInjectedBrowserExceptions } from "@/lib/analytics/injectedBrowserExceptions";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
if (token) {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    before_send: dropInjectedBrowserExceptions,
  });
}
