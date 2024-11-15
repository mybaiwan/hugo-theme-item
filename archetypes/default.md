---
title: {{ replace .Name "-" " " | title }}
date: {{ .Date }}

favicon:            # (可选) 站点图标, 为空时将尝试自动获取(!自动获取不适用于站内文章)
tags: []            # (可选) 站点标签, 与 data/tags.yaml 关联
categories: []      # (必填) 站点分类, 与 data/category.yaml 关联 (!没有分类的文章不会展示)
keywords: []        # (可选) 站点关键词, 这将有利于SEO
description:        # (可选) 站点描述, 30~50字为宜, 为空时将尝试以正文摘要作为回退

internal: false     # (可选) 标识此文章是否为站内文章
katex: false        # (可选) 是否启用katex解析latex公式


# 站内文章专用
author: 	        # (可选) 作者名称, 留空从站点配置中获取，否则为 Administrator

# 网址导航专用
rating: 4.5         # (可选) 站点评分，5分制
link:               # (必填) 站点访问地址, 填写 http(s) 地址
---