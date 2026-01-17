# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for creating custom Slack stamps (128×128px emojis). Users can create animated GIFs or static PNGs from either text with customizable styling or uploaded images.

## Commands

### Development
```bash
npm run dev    # Start development server (http://localhost:3000)
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Architecture

### Core Flow

The application follows a client-side rendering architecture where:

1. **State Management** (`app/page.tsx`): Main page holds all state including:
   - `mode`: Text or image mode
   - `textConfig`: All text styling configuration
   - `animationConfig`: Animation type and speed
   - `uploadedImage` and `croppedImage`: Image data for image mode

2. **Canvas Generation Pipeline**:
   - Text mode: `drawTextToCanvas()` → applies fonts, gradients, shadows, strokes, rotation
   - Image mode: `drawImageToCanvas()` → loads and draws cropped image
   - Animation: `generateAnimationFrames()` → creates frame sequence by applying transforms
   - Encoding: `encodeGIF()` → uses gifenc library to generate final GIF blob
   - Download: `downloadGIF()` or `downloadPNG()` → triggers browser download

3. **Section-Based UI** (`components/sections/`):
   Each UI section is isolated (TextInputSection, ColorSection, GradientSection, etc.) and receives:
   - Current config state
   - Update callback functions
   The main page composes these sections in tabs.

### Key Technical Details

**GIF Encoding** (`utils/gif-encoder.ts`):
- Uses `gifenc` library with global palette optimization
- All frames share a common 256-color palette generated from all frame pixels
- Alpha blending is done against white background (GIF requires solid background)
- Frame delay is calculated from speed parameter (1-10 → 200ms-20ms)

**Animation System** (`utils/animations.ts`):
- 10 animation types: blink, bounce, slide, rotate, shake, fade, zoom, swing, rainbow, sparkle
- Each animation type returns a `FrameTransform` (offsetX/Y, scale, rotation, opacity, hueRotate)
- Default 12 frames per loop (configured in `GIF_CONFIG.FRAME_COUNT`)
- Transforms are applied using canvas transforms and filters

**Text Rendering** (`utils/gif-encoder.ts` - `drawTextToCanvas()`):
- Multi-line text support with auto-scaling to fit 128×128 canvas
- Supports gradients (horizontal/vertical/diagonal)
- Layered rendering: shadow → stroke → fill
- Text is centered and can be rotated

**Image Handling**:
- Image cropping done with `react-image-crop` library in `components/image-cropper.tsx`
- Cropped result is stored as base64 data URL
- Images are drawn to 128×128 canvas maintaining aspect ratio

### State Flow Pattern

Updates follow this pattern:
```
User Input → Update Callback → setState → Re-render Preview
```

For nested config objects (gradient, shadow, stroke), specialized update functions like `updateGradient` are used to avoid recreating the entire config.

### File Organization

- `app/`: Next.js App Router pages
- `components/sections/`: Feature sections (text input, color, gradient, effects, animation, image, preview)
- `components/ui/`: shadcn/ui components (button, input, select, slider, tabs, etc.)
- `utils/`: Core canvas and GIF generation logic
- `types/`: TypeScript type definitions and defaults
- `constants/`: Font lists, animation presets, color presets, GIF config
- `hooks/`: Custom React hooks (useDebounce)

### Important Constants

- `OUTPUT_SIZE = 128`: Canvas dimensions for Slack compatibility
- `GIF_CONFIG.FRAME_COUNT = 12`: Frames per animation loop
- `MAX_FILE_SIZE = 5MB`: Image upload limit
- Font families are defined in `constants/fonts.ts`
- Animation presets in `constants/animations.ts`

### Preview System

The preview (`components/preview-canvas.tsx`) renders in real-time by:
1. Generating canvas based on current mode and config
2. If animation enabled: cycling through frames using `requestAnimationFrame`
3. Drawing current frame to visible canvas element
4. For static preview: just rendering single frame

## Development Notes

- The app is fully client-side ("use client" directive everywhere needed)
- Path alias `@/` maps to project root (configured in tsconfig.json)
- Uses Tailwind CSS v4 with custom theme
- Toast notifications via `sonner` library
- Type definitions for `gifenc` are in `types/gifenc.d.ts` (custom definitions)
- All canvas operations happen client-side in the browser
- No backend/API routes required for core functionality
