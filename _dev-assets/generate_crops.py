from PIL import Image, ImageDraw
import os

OUT = "c:/Users/it/OneDrive/Desktop/BioDeskClaude/BioDesk/src/assets/images/CropIcons"
os.makedirs(OUT, exist_ok=True)
SIZE = 120

GREEN = (46, 125, 50)
DARK_GREEN = (27, 94, 32)
LIGHT_GREEN = (76, 175, 80)
YELLOW = (255, 193, 7)
ORANGE = (255, 152, 0)
RED = (211, 47, 47)
BROWN = (121, 85, 42)
DARK_BROWN = (93, 64, 30)
TAN = (188, 162, 107)
PURPLE = (106, 27, 154)
LP = (156, 39, 176)

def nc():
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)

# BANANA - curved crescent
img, d = nc()
d.arc([10, 10, 110, 130], 200, 350, fill=YELLOW, width=28)
d.arc([10, 10, 110, 130], 200, 350, fill=(255, 235, 59), width=22)
d.arc([10, 10, 110, 130], 220, 330, fill=(255, 245, 120), width=12)
d.ellipse([72, 18, 85, 30], fill=BROWN)
d.ellipse([18, 62, 30, 72], fill=YELLOW)
img.save(os.path.join(OUT, "banana.png"))
print("banana.png")

# CHICKPEA
img, d = nc()
d.ellipse([25, 25, 95, 95], fill=TAN)
d.ellipse([28, 28, 92, 92], fill=(210, 190, 140))
d.arc([35, 30, 85, 90], 30, 150, fill=BROWN, width=2)
d.ellipse([52, 22, 68, 35], fill=(210, 190, 140))
img.save(os.path.join(OUT, "chickpea.png"))
print("chickpea.png")

# CHILLI
img, d = nc()
d.polygon([(55, 105), (40, 70), (35, 40), (45, 20), (55, 15), (60, 20), (58, 40), (62, 70)], fill=RED)
d.polygon([(52, 100), (42, 68), (38, 40), (48, 22), (55, 18), (58, 22), (56, 42), (60, 68)], fill=(229, 57, 53))
d.line([(48, 25), (45, 55)], fill=(239, 83, 80), width=3)
d.rectangle([50, 8, 60, 20], fill=GREEN)
d.ellipse([45, 5, 65, 18], fill=DARK_GREEN)
img.save(os.path.join(OUT, "chilli.png"))
print("chilli.png")

# CITRUS
img, d = nc()
d.ellipse([15, 20, 105, 105], fill=(255, 167, 38))
d.ellipse([18, 23, 102, 102], fill=ORANGE)
d.ellipse([28, 32, 92, 94], fill=(255, 183, 77))
d.line([(60, 35), (60, 90)], fill=(255, 152, 0), width=2)
d.line([(32, 63), (88, 63)], fill=(255, 152, 0), width=2)
d.line([(38, 40), (82, 85)], fill=(255, 152, 0), width=2)
d.line([(82, 40), (38, 85)], fill=(255, 152, 0), width=2)
d.ellipse([70, 5, 100, 28], fill=GREEN)
d.rectangle([58, 10, 64, 25], fill=DARK_GREEN)
img.save(os.path.join(OUT, "citrus.png"))
print("citrus.png")

# COFFEE
img, d = nc()
d.ellipse([25, 20, 95, 100], fill=BROWN)
d.ellipse([28, 23, 92, 97], fill=(139, 90, 43))
d.arc([38, 28, 82, 92], 60, 300, fill=DARK_BROWN, width=3)
d.arc([35, 30, 70, 70], 180, 300, fill=(160, 110, 55), width=3)
img.save(os.path.join(OUT, "coffee.png"))
print("coffee.png")

# COTTON
img, d = nc()
d.polygon([(40, 80), (30, 60), (45, 50), (60, 45), (75, 50), (90, 60), (80, 80)], fill=BROWN)
d.ellipse([30, 20, 65, 55], fill=(245, 245, 245))
d.ellipse([50, 15, 85, 50], fill=(250, 250, 250))
d.ellipse([35, 35, 70, 70], fill=(240, 240, 240))
d.ellipse([55, 30, 90, 65], fill=(248, 248, 248))
d.ellipse([40, 25, 75, 60], fill=(255, 255, 255))
d.rectangle([55, 75, 65, 110], fill=DARK_GREEN)
img.save(os.path.join(OUT, "cotton.png"))
print("cotton.png")

# GARLIC
img, d = nc()
d.ellipse([22, 30, 98, 105], fill=(235, 230, 220))
d.ellipse([25, 33, 95, 102], fill=(245, 240, 230))
d.arc([30, 35, 60, 98], 180, 360, fill=(200, 195, 185), width=2)
d.arc([50, 35, 80, 98], 180, 360, fill=(200, 195, 185), width=2)
d.line([(60, 35), (60, 95)], fill=(200, 195, 185), width=1)
d.polygon([(50, 35), (60, 8), (70, 35)], fill=(220, 215, 200))
d.rectangle([57, 2, 63, 15], fill=(200, 195, 180))
img.save(os.path.join(OUT, "garlic.png"))
print("garlic.png")

# GRAPES
img, d = nc()
positions = [(45,30),(65,30),(35,48),(55,48),(75,48),(45,66),(65,66),(55,84)]
for x,y in positions:
    d.ellipse([x-12,y-12,x+12,y+12], fill=PURPLE)
    d.ellipse([x-10,y-12,x+8,y+8], fill=LP)
d.rectangle([53, 5, 58, 32], fill=DARK_GREEN)
d.ellipse([60, 2, 90, 22], fill=GREEN)
img.save(os.path.join(OUT, "grapes.png"))
print("grapes.png")

# GROUNDNUT
img, d = nc()
d.ellipse([25, 15, 75, 60], fill=TAN)
d.ellipse([35, 50, 85, 95], fill=TAN)
d.ellipse([28, 18, 72, 57], fill=(210, 190, 140))
d.ellipse([38, 53, 82, 92], fill=(210, 190, 140))
d.ellipse([38, 45, 72, 60], fill=(180, 155, 100))
d.arc([32, 22, 68, 52], 0, 360, fill=BROWN, width=1)
d.arc([42, 55, 78, 88], 0, 360, fill=BROWN, width=1)
img.save(os.path.join(OUT, "groundnut.png"))
print("groundnut.png")

# MAIZE
img, d = nc()
d.rounded_rectangle([35, 15, 75, 95], radius=18, fill=YELLOW)
d.rounded_rectangle([38, 18, 72, 92], radius=16, fill=(255, 235, 59))
for y in range(22, 88, 10):
    for x in range(42, 70, 9):
        d.ellipse([x, y, x+7, y+7], fill=YELLOW)
d.polygon([(35, 80), (15, 105), (40, 95)], fill=GREEN)
d.polygon([(75, 80), (95, 105), (70, 95)], fill=GREEN)
d.polygon([(38, 85), (25, 112), (50, 98)], fill=LIGHT_GREEN)
d.line([(50, 15), (40, 2)], fill=(180, 155, 100), width=2)
d.line([(55, 15), (55, 2)], fill=(180, 155, 100), width=2)
d.line([(60, 15), (70, 2)], fill=(180, 155, 100), width=2)
img.save(os.path.join(OUT, "maize.png"))
print("maize.png")

# MUSTARD
img, d = nc()
d.line([(60, 110), (60, 30)], fill=GREEN, width=3)
d.line([(60, 50), (40, 30)], fill=GREEN, width=2)
d.line([(60, 60), (80, 40)], fill=GREEN, width=2)
for cx, cy in [(60, 22), (40, 22), (80, 32), (50, 38), (70, 45)]:
    d.ellipse([cx-8, cy-8, cx+8, cy+8], fill=YELLOW)
    d.ellipse([cx-5, cy-5, cx+5, cy+5], fill=(255, 235, 59))
d.ellipse([20, 65, 55, 85], fill=GREEN)
d.ellipse([65, 75, 100, 95], fill=GREEN)
img.save(os.path.join(OUT, "mustard.png"))
print("mustard.png")

# OILSEEDS
img, d = nc()
positions = [(40, 35), (70, 35), (55, 55), (35, 70), (75, 70)]
for x, y in positions:
    d.ellipse([x-12, y-10, x+12, y+10], fill=BROWN)
    d.ellipse([x-10, y-9, x+10, y+8], fill=(160, 120, 60))
    d.arc([x-8, y-6, x+8, y+6], 0, 180, fill=DARK_BROWN, width=1)
img.save(os.path.join(OUT, "oilseeds.png"))
print("oilseeds.png")

# POMEGRANATE
img, d = nc()
d.ellipse([18, 22, 102, 102], fill=(183, 28, 28))
d.ellipse([22, 26, 98, 98], fill=RED)
d.polygon([(42, 28), (48, 8), (54, 28)], fill=(183, 28, 28))
d.polygon([(54, 28), (60, 8), (66, 28)], fill=(183, 28, 28))
d.polygon([(66, 28), (72, 12), (78, 28)], fill=(183, 28, 28))
d.ellipse([30, 32, 55, 52], fill=(229, 57, 53))
d.arc([35, 40, 85, 85], 20, 160, fill=(244, 143, 177), width=3)
img.save(os.path.join(OUT, "pomegranate.png"))
print("pomegranate.png")

# PULSES
img, d = nc()
colors = [(255, 152, 0), (139, 90, 43), (210, 190, 140), (255, 167, 38), (180, 130, 60)]
positions = [(35, 30), (70, 25), (50, 55), (30, 70), (72, 65), (55, 85)]
for i, (x, y) in enumerate(positions):
    c = colors[i % len(colors)]
    d.ellipse([x-12, y-8, x+12, y+8], fill=c)
    d.arc([x-8, y-4, x+8, y+4], 180, 360, fill=(max(c[0]-30,0), max(c[1]-30,0), max(c[2]-20,0)), width=1)
img.save(os.path.join(OUT, "pulses.png"))
print("pulses.png")

# RICE
img, d = nc()
d.line([(60, 110), (55, 40)], fill=GREEN, width=3)
d.line([(55, 40), (40, 25)], fill=(200, 180, 100), width=2)
grain_positions = [(38, 22), (42, 18), (46, 15), (36, 28), (44, 25)]
for x, y in grain_positions:
    d.ellipse([x-5, y-3, x+5, y+3], fill=(245, 235, 180))
    d.ellipse([x-4, y-2, x+4, y+2], fill=(255, 245, 200))
d.polygon([(58, 60), (85, 45), (90, 55), (62, 70)], fill=GREEN)
d.polygon([(52, 75), (20, 65), (18, 72), (50, 82)], fill=LIGHT_GREEN)
img.save(os.path.join(OUT, "rice.png"))
print("rice.png")

# SOYBEAN
img, d = nc()
d.rounded_rectangle([25, 35, 95, 70], radius=16, fill=LIGHT_GREEN)
d.rounded_rectangle([28, 38, 92, 67], radius=14, fill=GREEN)
d.ellipse([35, 42, 52, 62], fill=(200, 230, 201))
d.ellipse([55, 42, 72, 62], fill=(200, 230, 201))
d.ellipse([75, 44, 88, 60], fill=(200, 230, 201))
d.line([(25, 52), (12, 42)], fill=DARK_GREEN, width=2)
img.save(os.path.join(OUT, "soybean.png"))
print("soybean.png")

# SUGARCANE
img, d = nc()
d.rounded_rectangle([42, 5, 62, 115], radius=8, fill=(129, 199, 132))
d.rounded_rectangle([45, 8, 59, 112], radius=6, fill=LIGHT_GREEN)
for y in [25, 45, 65, 85]:
    d.line([(42, y), (62, y)], fill=DARK_GREEN, width=2)
d.polygon([(60, 20), (95, 5), (98, 12), (62, 28)], fill=GREEN)
d.polygon([(44, 40), (10, 30), (8, 38), (42, 48)], fill=GREEN)
img.save(os.path.join(OUT, "sugarcane.png"))
print("sugarcane.png")

# TEA
img, d = nc()
d.ellipse([20, 25, 60, 55], fill=GREEN)
d.ellipse([45, 20, 85, 50], fill=DARK_GREEN)
d.ellipse([30, 40, 70, 70], fill=LIGHT_GREEN)
d.ellipse([50, 35, 90, 65], fill=GREEN)
d.ellipse([35, 55, 75, 80], fill=DARK_GREEN)
d.ellipse([48, 10, 65, 28], fill=(144, 238, 144))
d.line([(55, 78), (55, 110)], fill=BROWN, width=3)
img.save(os.path.join(OUT, "tea.png"))
print("tea.png")

# WHEAT
img, d = nc()
d.line([(60, 110), (58, 40)], fill=(180, 160, 80), width=3)
for i, y in enumerate(range(15, 55, 6)):
    offset = (i % 2) * 4
    d.ellipse([48+offset, y, 62+offset, y+10], fill=(220, 200, 100))
    d.ellipse([50+offset, y+1, 60+offset, y+9], fill=(240, 220, 120))
d.line([(55, 15), (42, 2)], fill=(200, 180, 90), width=1)
d.line([(60, 15), (65, 2)], fill=(200, 180, 90), width=1)
d.line([(58, 18), (75, 8)], fill=(200, 180, 90), width=1)
d.polygon([(56, 70), (85, 55), (88, 62), (58, 78)], fill=GREEN)
img.save(os.path.join(OUT, "wheat.png"))
print("wheat.png")

print("\nAll 27 crop icons generated!")
