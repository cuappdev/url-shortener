import Head from "next/head";
import Image from "next/image";
// @ts-ignore
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const fetchOrigUrl = async (shortUrl: string) => {
  const res = await fetch(`${process.env.SERVER}/links/${shortUrl}`);
  return await res.json();
};

const Short = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let encodedSearchParams: any = [];
  for (const [key, val] of searchParams.entries()) {
    encodedSearchParams.push(`${key}=${val}`);
  }

  const { short } = router.query;
  const [message, setMessage] = useState(`Redirecting...`);

  useEffect(() => {
    if (!short) return;
    (async () => {
      const orig = await fetchOrigUrl(
        `${short}?${encodedSearchParams.join("&")}`
      );
      if (orig.success) window.location.assign(orig.data);
      else setMessage("Error: Invalid link");
    })();
  }, [short]);

  return (
    <>
      <Head>
        <title>{message}</title>
      </Head>
      <div className="p-5">
        <div className="flex h-screen">
          <div className="flex flex-col justify-center items-center m-auto">
            <Image
              src="/logo-small.png"
              alt="AppDev Logo"
              width={50}
              height={50}
            />
            <h1 className="text-3xl mt-10 mb-10 font-serif">{message}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Short;
