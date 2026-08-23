from PIL import Image

def make_white_transparent_pil(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pix = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pix[x, y]
            # If the pixel is close to pure white background
            if r > 242 and g > 242 and b > 242:
                pix[x, y] = (0, 0, 0, 0)

    img.save(output_path, "PNG")
    print(f"Successfully saved clean transparent PNG to {output_path}")

make_white_transparent_pil(
    "/Users/ansh/.gemini/antigravity-ide/brain/262980b8-4f0e-4612-99a6-87aa345ef855/cartoon_listener_dark_bg_1787477259018.jpg",
    "/Users/ansh/Desktop/securityleaderpodcast/public/brand/cartoon-listener.png"
)
