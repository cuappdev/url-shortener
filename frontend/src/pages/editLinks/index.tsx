import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { auth } from "@/firebase/init";

const qrCodeWidth = 300;
const qrCodeMargin = 20;

interface Link {
    _id: any,
    shortUrl: string,
    originalUrl: string,
    urlVisits?: number,
    qrVisits?: number,
}

function download(href: string, name: string) {
    var a = document.createElement('a');

    a.download = name;
    a.href = href;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const saveQRCode = (qrCodeID: string) => {
    // this function was made with help from: https://levelup.gitconnected.com/draw-an-svg-to-canvas-and-download-it-as-image-in-javascript-f7f7713cf81f
    const qrCodeElement = document.getElementById(qrCodeID);
    if (qrCodeElement instanceof SVGGraphicsElement) {
        var svg = qrCodeElement as SVGGraphicsElement;
        var blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        let URL = window.URL || window.webkitURL || window;
        let blobURL = URL.createObjectURL(blob);
        let image = new Image();
        image.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = qrCodeWidth + 2 * qrCodeMargin;
            canvas.height = qrCodeWidth + 2 * qrCodeMargin;
            let context = canvas.getContext('2d');
            if (context) {
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, qrCodeMargin, qrCodeMargin, qrCodeWidth, qrCodeWidth);
            }
            let png = canvas.toDataURL();
            download(png, 'qr.png');
        };
        image.src = blobURL;
    }
    return '';
}

const LinkCard = ({ _id, shortUrl, originalUrl, urlVisits, qrVisits }: Link) => {
    const [edit, setEdit] = useState(false)
    const [short, setShort] = useState(shortUrl)
    const [orig, setOrig] = useState(originalUrl)
    const [qrModalVisible, setqrModalVisible] = useState(false)

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
                                <h1 className="font-serif text-2xl mb-5 break-all">
                                    Original: {orig}
                                </h1>
                                <h1 className="font-serif text-2xl mb-5 break-all">
                                    Direct Visits: {urlVisits ? urlVisits : 0}
                                </h1>
                                <h1 className="font-serif text-2xl break-all">
                                    QR Visits: {qrVisits ? qrVisits : 0}
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
                        <button className="btn ml-5" onClick={() => { setqrModalVisible(true); }}>QR Code</button>
                    }
                </div>
            </div>
            {qrModalVisible &&
                <div>
                    <input type="checkbox" id="qr-code-modal" className="modal-toggle" />
                    <div className="modal modal-open">
                        <div className="modal-box relative text-center">
                            <label htmlFor="qr-code-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setqrModalVisible(false)}>✕</label>
                            <h3 className="text-lg font-bold">QR Code for <span className="underline">{document.location.protocol + "//" + document.location.hostname + "/" + shortUrl}</span></h3>
                            <div style={{ backgroundColor: "#ffffff", padding: qrCodeMargin, marginTop: qrCodeMargin, marginBottom: qrCodeMargin, marginLeft: "auto", marginRight: "auto", width: qrCodeWidth }}>
                                <QRCode
                                    id="qr-code-img"
                                    size={qrCodeWidth}
                                    level={"H"}
                                    style={{ height: "auto", maxWidth: "100%" }}
                                    value={document.location.protocol + "//" + document.location.hostname + "/" + shortUrl + "?utm_source=qr"}
                                    viewBox={`0 0 ${qrCodeWidth} ${qrCodeWidth}`}
                                />
                            </div>
                            <button className="btn ml-5" onClick={() => saveQRCode("qr-code-img")}>Save Image</button>
                        </div>
                    </div>
                </div>
            }
        </div >
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