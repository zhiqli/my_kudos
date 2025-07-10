import cairosvg
import os

# 定义图标文件夹路径
icons_folder = "/Users/zhiqli/github/my_kudos/icons"

# 遍历文件夹中的所有SVG文件
for filename in os.listdir(icons_folder):
    if filename.endswith(".svg"):
        svg_path = os.path.join(icons_folder, filename)
        png_path = os.path.join(icons_folder, filename.replace(".svg", ".png"))
        
        print(f"正在转换: {svg_path} -> {png_path}")
        try:
            cairosvg.svg2png(url=svg_path, write_to=png_path)
        except Exception as e:
            print(f"转换失败: {e}")

print("\n所有SVG文件已成功转换为PNG！")
