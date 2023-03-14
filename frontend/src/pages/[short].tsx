import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const fetchOrigUrl = async (shortUrl: string) => {
    const res = await fetch(`${process.env.SERVER}/links/${shortUrl}`);
    return await res.json()
}

const Short = () => {
    const router = useRouter();
    const { short } = router.query;
    const [message, setMessage] = useState(`Redirecting...`)

    useEffect(() => {
        if (!short) return;
        (async () => {
            const orig = await fetchOrigUrl(short as string);
            if (orig.success)
                window.location.assign(orig.data);
            else
                setMessage("Error: Invalid link")
        })()
    }, [short]);

    return <>
        <Head>
            <title>{message}</title>
        </Head>
        <div className="p-5">
            <div className="flex h-screen">
                <div className="flex flex-col justify-center items-center m-auto">
                    <Image src="/logo-small.png" alt="AppDev Logo" width={50} height={50} />
                    <h1 className="text-3xl mt-10 mb-10 font-serif">{message}</h1>
                </div>

            </div>
        </div>
    </>;
}

export default Short;