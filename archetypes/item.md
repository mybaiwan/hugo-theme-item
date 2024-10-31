---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: false

link:               # 站点访问地址, 填写 http(s) 地址
favicon:            # 站点图标, 为空时将尝试自动获取
tags: []            # 站点标签, 2~3个为宜
categories: []      # 站点分类, 一般填写1个即可
description:        # 站点描述, 30~50字为宜

katex: false        # 是否启用katex解析latex公式
internal: false     # 标识此文章是否为站内文章
author: 		    # 作者名称, 留空从站点配置中获取，否则为 Administrator
---
