import { validateEmail } from "@/utils/commonUtils";
import { random } from "lodash";
import { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/redis";
import { AUTH_FAILED } from "@/utils/constants";

export async function POST(request: NextRequest) {
  const requestData = await request.json();
  const { email } = requestData;
  console.log("email", email);

  if (!email || !validateEmail(email)) {
    return Response.json({
      code: -1,
      message: "email format error",
    });
  }

  const redisClient = await getRedisClient();
  const cacheCode = await redisClient.get(`check:emailCode:${email}`);

  if (cacheCode) {
    return Response.json({
      code: -1,
      message: "send code too frequently",
    });
  }

  let randomCode = "";
  while (randomCode.length < 6) {
    randomCode += random(1, 9);
  }

  try {
    const res = await fetch("https://api.postmarkapp.com/email/withTemplate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": "d136fa7d-9598-42cf-925b-1ec502091b9f",
      },
      body: JSON.stringify({
        From: "info@mizu.global",
        To: email,
        TemplateId: 38054506,
        TemplateModel: {
          code: randomCode,
        },
      }),
    });

    const resJson = await res.json();

    if (resJson?.ErrorCode === 0) {
      redisClient.set(`check:emailCode:${email}`, randomCode, {
        EX: 60,
      });
      redisClient.set(`emailCode:${email}`, randomCode, {
        EX: 180,
      });
    }
    return Response.json({
      code: 0,
      data: {},
    });
  } catch (err) {
    return Response.json({
      code: AUTH_FAILED,
      message: "Telegram initData Auth failed",
    });
  }
}
