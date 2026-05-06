import React from 'react'

type Props = {
    qrUrl: string | null;
    show: boolean;
    onClose: () => void;
}

const QrModal = ({qrUrl, show, onClose}:Props) => {
    if(!show || !qrUrl) return null;
    return (
        <div>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-neutral-900 hover:text-black"
                    >
                        ✕
                    </button>
                    <p className="text-sm text-neutral-900 font-medium mb-3 text-center">
                        Employee QR Code
                    </p>

                    <img src={qrUrl} className="w-48 h-48 mx-auto" />

                </div>
            </div>

        </div>
    )
}

export default QrModal


