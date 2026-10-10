import sys
from PIL import Image, ImageFilter
import numpy as np

def extract_cutout(input_path, output_path):
    img = Image.open(input_path).convert('RGB')
    arr = np.array(img, dtype=np.float32)
    
    # Distance from white (255, 255, 255)
    diff = np.sqrt(np.sum((255.0 - arr) ** 2, axis=-1))
    
    # Smooth alpha feathering
    alpha = np.clip((diff - 16.0) / 22.0 * 255.0, 0, 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, mode='L')
    alpha_img = alpha_img.filter(ImageFilter.MedianFilter(size=3))
    
    rgba = img.convert('RGBA')
    rgba.putalpha(alpha_img)
    
    alpha_arr = np.array(alpha_img)
    ys, xs = np.where(alpha_arr > 30)
    cropped = rgba.crop((xs.min(), ys.min(), xs.max(), ys.max()))
    
    cropped.save(output_path, 'PNG')
    print(f"Processed: {output_path} (Size: {cropped.size})")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        extract_cutout(sys.argv[1], sys.argv[2])
