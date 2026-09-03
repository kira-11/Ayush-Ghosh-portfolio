import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { useGLTF } from '@react-three/drei';

// Shared singleton DRACOLoader instance pointing to local /draco/ WASM decoder
let dracoLoaderInstance = null;

export function getDracoLoader() {
  if (!dracoLoaderInstance) {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('/draco/');
    dracoLoaderInstance.setDecoderConfig({ type: 'wasm' });
    dracoLoaderInstance.preload();
  }
  return dracoLoaderInstance;
}

/**
 * Configure any GLTFLoader instance with Draco & Meshopt compression support
 */
export function configureGLTFLoader(loader) {
  loader.setDRACOLoader(getDracoLoader());
  loader.setMeshoptDecoder(MeshoptDecoder);
  return loader;
}

/**
 * Hook to load compressed GLTF/GLB models using Draco & Meshopt
 * Automatically decodes compressed vertex buffers with 0 visual degradation
 */
export function useCompressedGLTF(url) {
  return useGLTF(url, '/draco/', true, (loader) => {
    configureGLTFLoader(loader);
  });
}

/**
 * Preload helper for compressed models
 */
export function preloadCompressedGLTF(url) {
  useGLTF.preload(url, '/draco/', true, (loader) => {
    configureGLTFLoader(loader);
  });
}
