import { useState } from 'react';
import { Flex, TextInput, Button, Image, Text } from '@mantine/core';
import Draggable from 'react-draggable';
import { searchPexelsImages } from '@/services/pexelsService';

interface CanvasElement {
  id: number;
  src: string;
  x: number;
  y: number;
}

function MenuDesigner() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const handleSearch = async () => {
    try {
      const photos = await searchPexelsImages(
        query,
        import.meta.env.VITE_PEXELS_SECRET || ''
      );
      setResults(photos);
    } catch {
      setResults([]);
    }
  };

  const addImage = (photo: any) => {
    setElements((prev) => [
      ...prev,
      { id: Date.now(), src: photo.src.large2x, x: 0, y: 0 }
    ]);
  };

  const handleDrag = (idx: number, _e: any, data: any) => {
    setElements((prev) =>
      prev.map((el, i) => (i === idx ? { ...el, x: data.x, y: data.y } : el))
    );
  };

  return (
    <Flex direction="column" gap="md">
      <TextInput
        placeholder="Buscar en Pexels"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        rightSection={<Button size="xs" onClick={handleSearch}>Buscar</Button>}
      />
      <Flex gap="xs" wrap="wrap">
        {results.map((photo, idx) => (
          <Image
            key={idx}
            src={photo.src.tiny}
            width={80}
            onClick={() => addImage(photo)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </Flex>
      <div
        style={{ border: '1px solid #ccc', minHeight: 300, position: 'relative' }}
      >
        {elements.map((el, idx) => (
          <Draggable
            key={el.id}
            position={{ x: el.x, y: el.y }}
            onDrag={(e, data) => handleDrag(idx, e, data)}
          >
            <img src={el.src} style={{ maxWidth: 120 }} />
          </Draggable>
        ))}
        {elements.length === 0 && (
          <Text c="dimmed" ta="center" p="md">
            Arrastra imágenes aquí
          </Text>
        )}
      </div>
    </Flex>
  );
}

export default MenuDesigner;
