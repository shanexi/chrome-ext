#!/usr/bin/env python3
"""
Simple icon generator using SVG and conversion
"""
import os
import subprocess

def create_svg_icon(size):
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#45a049;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="{size}" height="{size}" rx="{size//5}" ry="{size//5}" fill="url(#grad1)" />
  <text x="{size//2}" y="{size//2 + size//8}" font-family="Arial" font-size="{size//2}" fill="white" text-anchor="middle">🔧</text>
</svg>'''
    return svg_content

def main():
    os.makedirs('icons', exist_ok=True)
    
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        # 创建 SVG 文件
        svg_content = create_svg_icon(size)
        svg_filename = f'icons/icon{size}.svg'
        
        with open(svg_filename, 'w') as f:
            f.write(svg_content)
        
        print(f'Generated {svg_filename}')
        
        # 尝试转换为 PNG（如果有 imagemagick 或其他工具）
        try:
            # 尝试使用 convert (ImageMagick)
            subprocess.run(['convert', svg_filename, f'icons/icon{size}.png'], 
                         check=True, capture_output=True)
            print(f'Converted to icon{size}.png')
        except (subprocess.CalledProcessError, FileNotFoundError):
            # 尝试使用 inkscape
            try:
                subprocess.run(['inkscape', '--export-png', f'icons/icon{size}.png', 
                              '--export-width', str(size), '--export-height', str(size), 
                              svg_filename], check=True, capture_output=True)
                print(f'Converted to icon{size}.png')
            except (subprocess.CalledProcessError, FileNotFoundError):
                print(f'Could not convert {svg_filename} to PNG. SVG file created instead.')
    
    print('Icon generation complete!')

if __name__ == '__main__':
    main()