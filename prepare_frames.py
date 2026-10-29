import os
import re
import sys
import time
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

def process_single_frame(task):
    src_path, dst_desktop, dst_mobile = task
    # Load image
    with Image.open(src_path) as im:
        im = im.convert('RGB')
        w, h = im.size
        # Target aspect ratio is 16:9 (1280x720 is 16:9)
        # Desktop: 1600x900, quality 78
        im_desktop = im.resize((1600, 900), Image.Resampling.LANCZOS)
        im_desktop.save(dst_desktop, 'WEBP', quality=78, method=6)
        
        # Mobile: 960x540, quality 72
        im_mobile = im.resize((960, 540), Image.Resampling.LANCZOS)
        im_mobile.save(dst_mobile, 'WEBP', quality=72, method=6)

def get_folder_stats(path):
    files = [f for f in os.listdir(path) if f.endswith('.webp')]
    total_size = sum(os.path.getsize(os.path.join(path, f)) for f in files)
    return len(files), total_size

def main():
    start_time = time.time()
    
    # 1. Output directories
    out_hero = os.path.join('assets', 'frames', 'hero')
    out_hero_mob = os.path.join('assets', 'frames', 'hero-mobile')
    out_dismantle = os.path.join('assets', 'frames', 'dismantle')
    out_dismantle_mob = os.path.join('assets', 'frames', 'dismantle-mobile')
    out_cars = os.path.join('assets', 'cars')
    
    for d in [out_hero, out_hero_mob, out_dismantle, out_dismantle_mob, out_cars]:
        os.makedirs(d, exist_ok=True)
        
    # 2. Gather Hero frames
    c1 = sorted(os.listdir('clip1frame'), key=natural_sort_key)
    c2 = sorted(os.listdir('clip2frame'), key=natural_sort_key)
    c3 = sorted(os.listdir('clip3frame'), key=natural_sort_key)
    
    # Clip 1: all frames (0..199)
    # Clip 2: skip first frame (1..199)
    # Clip 3: skip first frame (1..199)
    hero_srcs = []
    for f in c1:
        hero_srcs.append(os.path.join('clip1frame', f))
    for f in c2[1:]:
        hero_srcs.append(os.path.join('clip2frame', f))
    for f in c3[1:]:
        hero_srcs.append(os.path.join('clip3frame', f))
        
    print(f"Hero source frames count: {len(hero_srcs)} (clip1={len(c1)}, clip2={len(c2)-1}, clip3={len(c3)-1})")
    
    # 3. Gather Dismantle frames
    fd = sorted(os.listdir('flowclipframe'), key=natural_sort_key)
    dismantle_srcs = [os.path.join('flowclipframe', f) for f in fd]
    print(f"Dismantle source frames count: {len(dismantle_srcs)}")
    
    # 4. Build task list
    tasks = []
    for idx, src in enumerate(hero_srcs, start=1):
        num_str = f"{idx:04d}"
        dst_desk = os.path.join(out_hero, f"frame_{num_str}.webp")
        dst_mob = os.path.join(out_hero_mob, f"frame_{num_str}.webp")
        tasks.append((src, dst_desk, dst_mob))
        
    for idx, src in enumerate(dismantle_srcs, start=1):
        num_str = f"{idx:04d}"
        dst_desk = os.path.join(out_dismantle, f"frame_{num_str}.webp")
        dst_mob = os.path.join(out_dismantle_mob, f"frame_{num_str}.webp")
        tasks.append((src, dst_desk, dst_mob))
        
    print(f"Total frame pairs to generate: {len(tasks)} (Total {len(tasks)*2} WebP files)")
    
    # 5. Multiprocessing conversion
    cpu_count = os.cpu_count() or 4
    print(f"Running conversion with {cpu_count} workers...")
    
    with ProcessPoolExecutor(max_workers=cpu_count) as executor:
        for _ in executor.map(process_single_frame, tasks, chunksize=10):
            pass
            
    # 6. Cars placeholder generation
    # Use the first fully assembled frame of dismantle: flowclipframe/ezgif-frame-001.jpg
    first_dismantle_frame = dismantle_srcs[0]
    car_models = ['gt-e', 's', 'x', 'r', 'one']
    with Image.open(first_dismantle_frame) as im:
        im = im.convert('RGB')
        im_1600 = im.resize((1600, 900), Image.Resampling.LANCZOS)
        for model in car_models:
            car_path = os.path.join(out_cars, f"{model}.webp")
            im_1600.save(car_path, 'WEBP', quality=78, method=6)
            print(f"Generated placeholder for {car_path}")
            
    # 7. Print stats
    h_count, h_size = get_folder_stats(out_hero)
    hm_count, hm_size = get_folder_stats(out_hero_mob)
    d_count, d_size = get_folder_stats(out_dismantle)
    dm_count, dm_size = get_folder_stats(out_dismantle_mob)
    c_count, c_size = get_folder_stats(out_cars)
    
    elapsed = time.time() - start_time
    print(f"\n--- CONVERSION COMPLETED IN {elapsed:.2f}s ---")
    print(f"assets/frames/hero: {h_count} frames, {h_size / (1024*1024):.2f} MB ({h_size} bytes)")
    print(f"assets/frames/hero-mobile: {hm_count} frames, {hm_size / (1024*1024):.2f} MB ({hm_size} bytes)")
    print(f"assets/frames/dismantle: {d_count} frames, {d_size / (1024*1024):.2f} MB ({d_size} bytes)")
    print(f"assets/frames/dismantle-mobile: {dm_count} frames, {dm_size / (1024*1024):.2f} MB ({dm_size} bytes)")
    print(f"assets/cars: {c_count} images, {c_size / (1024*1024):.2f} MB ({c_size} bytes)")

if __name__ == '__main__':
    main()

