interface ImageRowProps {
    onImageSelect: (imageUrl: string) => void; 
}

function ImageRow({ onImageSelect }: ImageRowProps) {
    const imageUrls = [
        '0.png','1.png', '2.png', '3.png', '4.png', '5.png'
    ];
    const descriptions = [
        'Bloco nulo, para excluir outros blocos',
        'Bloco chão, percorrivel pelo personagem',
        'Bloco grama, decorativo',
        'Bloco chave, necessário para abrir a porta',
        'Bloco porta, para concluir o nivel',
        'Bloco personagem, controlavel pelo jogador'
    ]
    return (
        <div className="image-row">
            {imageUrls.map((imageUrl, index) => (
                <img
                    key={index}
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    style={{ width: '10px', height: '10px', marginRight: '5px' }}
                    onClick={() => onImageSelect(imageUrl)}
                    title={descriptions[index]}
                />
            ))}
        </div>
    );
}

export default ImageRow;