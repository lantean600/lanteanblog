---
title: 《Pytorch实用教程》笔记（一）数据模块
date: 2026-04-16
category: daily
tags:
  - pytorch
collection: pytorch-深度学习
heroImage: /images/kayuya.jpg
heroLink: https://www.pixiv.net/en/artworks/142350190
excerpt: 文章摘要
---
## 数据处理流程

\[[COVID19图像分类－数据处理流程图.canvas]]
(安卓端无法导出为矢量图 之后会优化这个画布引用)

## Dataset

这个模块的学习主要还是读代码。我之前主要精读了一个函数代码，笔记如下：

```python
def get_img_info(self):
	# 功能：读取硬盘数据，并建立数据标签，将二者组成元组存在列表中
	for root, dirs, files in os.walk(root_dir):
		# os: operation system
		# walk(): 接受一个文件夹路径（root），返回一个生成器(root, dirs, files)
		for file in files:
			if file.endwith('jpeg') or file.endwith('png'):
				# 取文件路径
				path_img = os.path.join(root, file) # path.join(): 路径拼贴
				# 取子目录
				sub_dir = os.path.basename(root) # basename(): 取末级路径
				# 子目录转为整数标签
				lable_int = self.str_2_int[sub_dir] # str_2_int: 在__init_-定义的字典
				# 保存为元组列表
				self.info_img.append(path_img, label_int)
```

## DataLoader
