import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { auth } from "@/firebase/init";

interface Link {
    _id: any,
    shortUrl: string,
    originalUrl: string,
}

const LinkCard = ({ shortUrl, originalUrl, _id }: any) => {
    const [edit, setEdit] = useState(false)
    const [short, setShort] = useState(shortUrl)
    const [orig, setOrig] = useState(originalUrl)
    const [qrVisible, setQrVisible] = useState(false)

    const updateLink = async () => {
        const res = await fetch(`${process.env.SERVER}/links/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await auth.currentUser?.getIdToken(true)}`,
            },
            body: JSON.stringify({
                shortUrl: short,
                originalUrl: orig,
            })
        })

        const json = await res.json();
        return json;
    }

    return (
        <div className="card bg-gray-800 md:w-5/12 mb-10 text-left">
            <div className="card-body">
                <div className="flex">
                    <div className="flex-auto">
                        {!edit &&
                            <>
                                <h1 className="font-serif text-2xl mb-5 break-all">
                                    Alias: {short}
                                </h1>
                                <h1 className="font-serif text-2xl break-all">
                                    Original: {orig}
                                </h1>
                            </>
                        }
                        {edit &&
                            <>
                                <h1>Alias</h1>
                                <input
                                    type="text"
                                    value={short}
                                    onChange={e => setShort(e.target.value)}
                                    className="input input-bordered md:w-80 mb-5"
                                />
                                <h1>Original</h1>
                                <input
                                    type="text"
                                    value={orig}
                                    onChange={e => setOrig(e.target.value)}
                                    className="input input-bordered md:w-80"
                                />
                            </>
                        }
                    </div>

                    <div className="card-actions justify-end flex-auto">
                        <button className="btn" onClick={() => setEdit(!edit)}>{edit ? "Cancel" : "Edit"}</button>
                    </div>
                    {edit &&
                        <button className="btn ml-5" onClick={() => { updateLink(); setEdit(!edit) }}>Save</button>
                    }
                    {!edit &&
                        <button className="btn ml-5" onClick={() => { setQrVisible(true); }}>QR Code</button>
                    }
                </div>
            </div>
            {qrVisible &&
                <div>
                    <input type="checkbox" id="qr-code-modal" className="modal-toggle" />
                    <div className="modal modal-open">
                        <div className="modal-box relative">
                            <label htmlFor="qr-code-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setQrVisible(false)}>✕</label>
                            <h3 className="text-lg font-bold">QR Code for <span className="underline">{document.location.protocol + "//" + document.location.hostname + "/" + shortUrl}</span>:</h3>
                            <QRCode
                                size={256}
                                level={"H"}
                                style={{ height: "auto", maxWidth: "100%", width: "100%", padding: "20px", backgroundColor: "#ffffff", margin: "20px" }}
                                value={document.location.protocol + "//" + document.location.hostname + "/" + shortUrl}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

const EditLinks = () => {
    const [links, setLinks] = useState<Link[]>([])
    const router = useRouter();

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            const allData = await fetch(`${process.env.SERVER}/links`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user?.getIdToken(true)}`
                }
            })
            setLinks(await allData.json())
        });
    }, [])

    return (
        <>
            <Head>
                <title>AppDev Shortlinks</title>
            </Head>
            <div className="p-5">
                <div className="text-sm breadcrumbs">
                    <ul>
                        <li><a onClick={() => router.push('/login')}>Home</a></li>
                        <li><a onClick={() => router.push('/createLink')}>Create</a></li>
                        <li><a>Edit</a></li>
                    </ul>
                </div>
                <div className="text-center">
                    <h1 className="text-6xl mt-10 mb-10 font-serif">Edit Existing Links</h1>
                    <div className="flex flex-col justify-center items-center">
                        {
                            links.map((link, idx) => (
                                <LinkCard key={`link${idx}`} {...link} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditLinks;