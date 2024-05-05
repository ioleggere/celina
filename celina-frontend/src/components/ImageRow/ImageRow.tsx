interface ImageRowProps {
    onImageSelect: (imageUrl: string) => void; 
}

function ImageRow({ onImageSelect }: ImageRowProps) {
    const imageUrls = [
        '0.png','1.png', '2.png', '3.png', '4.png', '5.png'
    ];

    return (
        <div className="image-row">
            {imageUrls.map((imageUrl, index) => (
                <img
                    key={index}
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    style={{ width: '10px', height: '10px', marginRight: '5px' }}
                    onClick={() => onImageSelect(imageUrl)}
                />
            ))}
        </div>
    );
}

export default ImageRow;