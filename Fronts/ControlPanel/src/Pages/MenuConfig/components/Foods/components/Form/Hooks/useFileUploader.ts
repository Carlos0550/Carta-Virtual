import React, { useState } from 'react'
import imageCompression from "browser-image-compression"

function useFileUploader() {
    const [fileData, setFileData] = useState<File | null>(null)
    const [processingFile, setProcessingFile] = useState<boolean>(false)

    async function compressAndConvertToWebp(file: File): Promise<File> {
        console.log(`Comprimiendo ${file.name} y extensión "${file.type}" con un tamaño de ${file.size} bytes`)

        const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        })
        console.log(`Comprimido, nuevo tamaño: ${compressed.size} bytes`)
        const imageBitmap = await createImageBitmap(compressed)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        canvas.width = imageBitmap.width
        canvas.height = imageBitmap.height
        ctx.drawImage(imageBitmap, 0, 0)

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    if (blob) {
                        const webpFile = new File([blob], `${file.name.split('.')[0]}.webp`, {
                            type: 'image/webp',
                            lastModified: Date.now()
                        })
                        resolve(webpFile)
                    } else {
                        reject(new Error('No se pudo convertir a WebP'))
                    }
                },
                'image/webp',
                0.8
            )
        })
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setProcessingFile(true)
            const file = files[0]
            const processedImage = await compressAndConvertToWebp(file)
            await new Promise((res) => setTimeout(res, 1000))
            setFileData(processedImage)
            setProcessingFile(false)
        }
        return;
    }
    return {
        fileData, setFileData,
        handleUpload, processingFile
    }
}

export default useFileUploader