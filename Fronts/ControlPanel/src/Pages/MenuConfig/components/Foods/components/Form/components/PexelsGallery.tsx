// PexelsGallery.tsx
import { Flex, Text, Button, Paper, Box } from '@mantine/core';

interface PexelsGalleryProps {
  pexelsImages: any[];
  showPexelsGallery: boolean;
  onSelectImage: (photo: any) => void;
  onClose: () => void;
  onRetry: () => void;
}

function PexelsGallery({
  pexelsImages,
  showPexelsGallery,
  onSelectImage,
  onClose,
  onRetry
}: PexelsGalleryProps) {
  if (!showPexelsGallery || pexelsImages.length === 0) return null;

  return (
    <Paper withBorder p="md" radius="md">
      <Flex direction="column" gap="md">
        <Flex align="center" justify="space-between">
          <Text fw={500}>Elige una imagen de Pexels:</Text>
          <Flex gap="xs">
            <Button type="button" variant="outline" color="blue" size="xs" onClick={onRetry}>
              🔄 Reintentar
            </Button>
            <Button type="button" variant="subtle" color="gray" size="xs" onClick={onClose}>
              ✕
            </Button>
          </Flex>
        </Flex>
        <Flex gap="sm" wrap="wrap" justify="center">
          {pexelsImages.map((photo, i) => (
            <Box
              key={i}
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'border-color 0.2s'
              }}
              onClick={() => onSelectImage(photo)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#228be6')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <img
                src={photo.src.small}
                alt={`Opción ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Flex>
        <Text size="xs" color="dimmed" ta="center">
          Haz click para seleccionar
        </Text>
      </Flex>
    </Paper>
  );
}

export default PexelsGallery;
