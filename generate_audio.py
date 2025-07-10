from gtts import gTTS
import os

# 定义输出文件夹路径
output_folder = "/Users/zhiqli/github/my_kudos/audio_pkg/audios"

# 确保文件夹存在
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 设置语言为中文
language = 'zh-cn'

# 循环生成1到120的音频文件
for i in range(1, 121):
    text = str(i)
    file_path = os.path.join(output_folder, f"{text}.mp3")
    
    # 如果文件已存在，则跳过，避免重复生成
    if os.path.exists(file_path):
        print(f"文件已存在，跳过: {text}.mp3")
        continue
        
    print(f"正在生成: {text}.mp3")
    try:
        # 创建gTTS对象并保存文件
        speech = gTTS(text=text, lang=language, slow=False)
        speech.save(file_path)
    except Exception as e:
        print(f"生成 {text}.mp3 时发生错误: {e}")

# 单独生成“完成”的提示音
completion_file_path = os.path.join(output_folder, "完成.mp3")
if not os.path.exists(completion_file_path):
    print("正在生成: 完成.mp3")
    try:
        speech = gTTS(text="完成", lang=language, slow=False)
        speech.save(completion_file_path)
    except Exception as e:
        print(f"生成 完成.mp3 时发生错误: {e}")
else:
    print("文件已存在，跳过: 完成.mp3")

# 单独生成“滴”的提示音
di_file_path = os.path.join(output_folder, "di.mp3")
if not os.path.exists(di_file_path):
    print("正在生成: di.mp3")
    try:
        speech = gTTS(text="滴", lang=language, slow=False)
        speech.save(di_file_path)
    except Exception as e:
        print(f"生成 di.mp3 时发生错误: {e}")
else:
    print("文件已存在，跳过: di.mp3")

print("\n音频文件生成任务已完成！")
