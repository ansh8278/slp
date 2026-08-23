from PIL import Image

def remove_checkerboard(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # Flood fill from top-left, top-right, bottom-left, bottom-right corners
    # Any pixel that is checkerboard gray/white outside the character sticker contour gets set to (0,0,0,0)
    visited = set()
    queue = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]

    # Checkerboard gray/white pixel check
    def is_bg(r, g, b):
        # Checkerboard colors are gray (around 200..230) or white (around 240..255) where r~=g~=b
        diff = max(abs(r - g), abs(r - b), abs(g - b))
        return diff < 15 and (r > 180 and g > 180 and b > 180)

    for q in queue:
        visited.add(q)

    while queue:
        x, y = queue.pop(0)
        r, g, b, a = pixels[x, y]

        if is_bg(r, g, b):
            pixels[x, y] = (0, 0, 0, 0)
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    img.save(output_path, "PNG")
    print("Background removed successfully!")

remove_checkerboard(
    "/Users/ansh/.gemini/antigravity-ide/brain/262980b8-4f0e-4612-99a6-87aa345ef855/cartoon_podcast_listener_1787477116652.jpg",
    "/Users/ansh/Desktop/securityleaderpodcast/public/brand/cartoon-listener.png"
)
remove_checkerboard(
    "/Users/ansh/.gemini/antigravity-ide/brain/262980b8-4f0e-4612-99a6-87aa345ef855/cartoon_guest_avatar1_1787477134988.jpg",
    "/Users/ansh/Desktop/securityleaderpodcast/public/brand/cartoon-guest-1.png"
)
